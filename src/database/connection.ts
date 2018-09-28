import * as Sequelize from 'sequelize';
require('dotenv').config();

export class Connection
{
    private static _instance: Connection;
    private readonly _sequelize: any;
    private _user: any;
    private _exhibit: any;

    private constructor()
    {
        this._sequelize = new Sequelize('null', 'null', 'null', {
            dialect: 'sqlite',
            storage: 'database.sqlite',
            logging: false
        });
        this.initDatabaseTables();
        this.initDatabaseRelations();

        this._sequelize.sync({force: true});
    }

    public static getInstance(): Connection
    {
        if(Connection._instance === null || Connection._instance === undefined)
        {
            Connection._instance = new Connection();
        }

        return Connection._instance;
    }

    private initDatabaseRelations(): void
    {
        //User to Group Relation (1:n)
        this._exhibit.hasMany(this._user, {onDelete: 'cascade'});
        this._user.belongsTo(this._exhibit);
    }

    private initDatabaseTables():void
    {
        this._user = this._sequelize.define('user', {
            id: {
                type: Sequelize.STRING,
                primaryKey: true,
            },
            name: {
                type: Sequelize.STRING,
                allowNull: false
            },
            location: {
                type: Sequelize.STRING,
                allowNull: true
            },
            statusTime: {
                type: Sequelize.DATE,
                alllowNull: true
            },
            message: {
                type: Sequelize.STRING,
                allowNull: false,
                defaultValue: ""
            },
            socketId: {
                type: Sequelize.STRING,
                allowNull: false,
            }
        });

        this._exhibit = this._sequelize.define('exhibit', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true
            },
            contentURL: {
               type: Sequelize.STRING
            },
            contentVersion: {
               type: Sequelize.DOUBLE,
                defaultValue: 1.0
            },
            ipAddress: {
               type: Sequelize.STRING,
                allowNull: false
            },
            description: {
                type: Sequelize.STRING,
                allowNull: false
            },
            currentSeat: {
                type: Sequelize.INTEGER,
                allowNull: true
            },
            maxSeat: {
                type: Sequelize.INTEGER,
                allowNull: true,
                defaultValue: 1
            }
        });
    }

    get exhibit(): any {
        return this._exhibit;
    }

    get user(): any {
        return this._user;
    }

    get sequelize(): any {
        return this._sequelize;
    }
}
