
import { Connection } from '../database';

export class OdController
{
    private database: Connection;

    constructor()
    {
        this.database = Connection.getInstance();
    }

    public connectOD(data: any): any
    {
        const identifier = data.user.id;
        const username = data.user.name;
        const locationName = data.location.description;

        return this.database.user.create({
            id: identifier,
            name: username,
            location: locationName,
            statusTime: Date.now()
        }).then( () => {
            return "Connected to Table"
        }).catch((err) => {
            console.log(err);
            return "FAILED";
        });
    }

    public requestData(): any
    {
        return this.database.user.findAll().then((users) =>{
            return {users};
        }).catch((err) => {
            return "Failed";
        });
    }

    public updateMessage(data): any
    {
        const message = data.message;
        return this.database.user.findById(data.user.id).then((user) =>{
            let newMessage = user.message + message;
            return this.database.user.update({message: newMessage},{where: {id: user.id}}).then(() => {
                return this.database.user.findAll().then((users) =>{
                    return users;
                });
            });
        });
    }

    public removeUser(user): any
    {
        return this.database.user.destroy({where: {id: user.id}}).then(() =>{
            return "SUCCESS";
        }).catch((err) => {
            return "Failed";
        });
    }

    public findAllUsers(): any
    {
        return this.database.user.findAll().then((users) =>{
            return users;
        }).catch((err) => {
            return "Failed";
        });
    }

    public findUser(id: Number): any
    {
        return this.database.user.findById(id).then((user) =>{
            return user;
        }).catch((err) => {
            return "Failed";
        });
    }


    public updateUserStatus(user): void
    {
        this.database.user.update({statusTime: Date.now()},{where: {id: user.id}});
    }
}