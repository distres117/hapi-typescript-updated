import * as Hapi from "hapi";
import * as Boom from "boom";
import { IDatabase } from "../../database";
import { IServerConfigurations } from "../../configurations";

export default class MockController {
    constructor(
        private configs: IServerConfigurations, 
        private database: IDatabase
    ) {}

    public getMocks(request:Hapi.Request, reply:Hapi.ReplyNoContinue){
        const data = {
            hi:'there'
        };
        reply(data).code(200);
    }
}