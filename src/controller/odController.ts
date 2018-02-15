
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
            location: locationName
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

    public findNotRespondingUser(): any
    {
        return this.database.user.find({where: {statusTime: { gt: this.database.sequelize.literal("NOW() - INTERVAL 10 MINUTE") }}})
            .then( users => { return users; });
    }


    public updateUserStatus(user): void
    {
        this.database.user.update({statusTime: Date.now()},{where: {id: user.id}});
    }
}