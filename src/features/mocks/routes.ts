import { IDatabase } from './../../database';
import { IServerConfigurations } from './../../configurations/index';
import * as Hapi from 'hapi';
import MockController from "./mock-controller";

export default function (server: Hapi.Server, configs:IServerConfigurations, database:IDatabase){
    const controller = new MockController(configs,database);
    server.bind(controller);

    server.route({
        method: 'GET',
        path:'/mocks',
        config:{
            handler: controller.getMocks
        }
    })
}