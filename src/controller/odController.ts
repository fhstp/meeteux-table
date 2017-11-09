
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
        const tmp = JSON.parse(data);
        const identifier = tmp.id;
        const username = tmp.name;

        return this.database.user.create({
            id: identifier,
            name: username,
        }).then( (user) => {
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

    public removeUser(user): any
    {
        return this.database.user.destroy({where: {id: user.id}}).then(() =>{
            return "SUCCESS";
        }).catch((err) => {
            return "Failed";
        });
    }
}