import { IDatabase } from './../src/database';
import * as Configs from "../src/configurations";
import * as Server from "../src/server";
import * as Database from "../src/database";
import * as Hapi from 'hapi';

export class SpecHelper{
    public server: Hapi.Server;
    public database:IDatabase;
    constructor(){}
    async start(){
        const serverConfig = Configs.getServerConfigs();
        const configDb = Configs.getDatabaseConfig();
        this.database = Database.init(configDb);
        this.server = await Server.init(serverConfig,this.database);
    }
}