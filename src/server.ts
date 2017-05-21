import { IFeature } from './features/interfaces';
import * as Hapi from "hapi";
import { IPlugin } from "./plugins/interfaces";
import { IServerConfigurations } from "./configurations";
import TasksFeature from "./features/tasks";
import UserFeature from "./features/users";
import MockFeature from './features/mocks';
import { IDatabase } from "./database";


export async function init(configs: IServerConfigurations, database: IDatabase) {
    const port = process.env.port || configs.port;
    const server = new Hapi.Server();

    server.connection({
        port: port,
        routes: {
            cors: true
        }
    });
    //  Setup Hapi Plugins
    const plugins: Array<string> = configs.plugins;
    const pluginOptions = {
        database: database,
        serverConfigs: configs
    };
    let promises: Array<Promise<any>> = [];
    plugins.forEach((pluginName: string) => {
        var plugin: IPlugin = (require("./plugins/" + pluginName)).default();
        console.log(`Register Plugin ${plugin.info().name} v${plugin.info().version}`);
        promises.push(plugin.register(server, pluginOptions));
    });

    //declare features here...
    let features = [
        TasksFeature,
        MockFeature,
        UserFeature
    ];
    
    let instances:IFeature[] = [];
    features.forEach((Feature,i)=>{
        instances.push(new Feature(server, configs, database));
    });

    await Promise.all(promises);
    instances.forEach(instance=>instance.init());   
    return server;
};