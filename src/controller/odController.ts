
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
        const identifier: string = data.identifier;
        const name: string = data.name;

        return this.database.user.create({
            id: identifier,
            name: name,
        }).then( (user) => {
            return "Connected to Table"
        }).catch((err) => {
            //console.log(err);
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
}