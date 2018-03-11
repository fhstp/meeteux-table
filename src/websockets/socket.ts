import * as IO from 'socket.io';
import * as IOClient from 'socket.io-client';
import  { Connection, Store } from '../database';
import { OdController } from "../controller";
import * as os from 'os';

export class WebSocket
{
    private odSocket: any;
    private godSocket: any;
    private database: any;
    private odController: OdController;
    private store: Store;
    private EXPIRATION_TIME = 1000 * 60 * 2;

    constructor(server: any)
    {
        this.odSocket = new IO(server);
        this.godSocket = IOClient.connect('https://localhost:3000/');
        this.odController = new OdController();
        this.database = Connection.getInstance();
        this.store = Store.getInstance();

        this.attachODListeners();
        this.attachGodListeners();
    }

    private attachODListeners(): void
    {
        this.odSocket.on('connection', (socket) =>
        {
            this.startUserStatusIntervall(socket);
            socket.emit('connected', 'Client Table connected to Server!');

            socket.on('connectOD', (data) =>
            {
                this.odController.connectOD(data).then( (values) =>
                {
                    socket.emit('connectODResult', values);
                });

                this.odController.requestData().then( (values) =>
                {
                    socket.broadcast.emit('requestDataResult', values);
                });
            });

            socket.on('requestData', () =>
            {
                this.odController.requestData().then( (values) =>
                {
                    socket.emit('requestDataResult', values);
                });
            });

            socket.on('closeConnection', (user) =>
            {
                this.odController.removeUser(user).then( (result) =>
                {
                    socket.emit('closeConnectionResult', result);

                    this.odController.requestData().then( (values) =>
                    {
                        socket.broadcast.emit('requestDataResult', values);
                    });
                });
            });
        });
    }

    private attachGodListeners(): void
    {
        this.godSocket.on('news', (message) => {
            console.log(message);
            this.loginExhibit();
        });

        this.godSocket.on('loginExhibitResult', (result) => {
            this.store.location = result.data;
        });
    }

    public loginExhibit()
    {
        const ifaces = os.networkInterfaces();

        let address;

        Object.keys(ifaces).forEach(function (ifname) {
            ifaces[ifname].forEach(function (iface) {
              if ('IPv4' !== iface.family || iface.internal !== false) {
                // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
                return;
              }
            
              address = iface.address;

            });
          });

        console.log('IP-Adresse: ' + address);
        this.godSocket.emit('loginExhibit', address);
    }

    private startUserStatusIntervall(socket: any): void
    {
        setInterval(() => {
            this.odController.findAllUsers().then( (users) =>
            {
                if(users !== null)
                {
                    let deleteUsers = [];
                    for (let user of users)
                    {
                        if(((Date.now()) - user.statusTime) > this.EXPIRATION_TIME)
                        {
                            // console.log((Date.now()) - user.statusTime + " ______ "+ this.EXPIRATION_TIME);
                            this.odController.removeUser(user);
                            deleteUsers.push(user);
                        }
                    }

                    if(deleteUsers.length > 0)
                    {
                        this.godSocket.emit('disconnectNotRespondingUsers', deleteUsers);
                    }
                }

                this.odController.requestData().then( (values) =>
                {
                    socket.broadcast.emit('requestDataResult', values);
                });
            });
            socket.broadcast.emit('exhibitStatusCheck');
        }, 1000 * 30);

        socket.on('exhibitStatusCheckResult', (user) => {
            this.odController.updateUserStatus(user);
        });
    }
}