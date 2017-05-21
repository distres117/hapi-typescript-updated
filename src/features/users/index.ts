import { IFeature } from './../interfaces';
import * as Hapi from "hapi";
import Routes from "./routes";
import { IDatabase } from "../../database";
import { IServerConfigurations } from "../../configurations";

export default class UserFeature implements IFeature {
    constructor(
        private server: Hapi.Server,
        private configs: IServerConfigurations,
        private database: IDatabase
    ){}
    init(){
        Routes(this.server, this.configs, this.database);
    }
}