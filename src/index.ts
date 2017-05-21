import * as Server from "./server";
import * as Database from "./database";
import * as Configs from "./configurations";

console.log(`Running enviroment ${process.env.NODE_ENV || "dev"}`);

//Starting Application Server
(async function start() {
    const dbConfigs = Configs.getDatabaseConfig();
    const serverConfigs = Configs.getServerConfigs();
    const database = Database.init(dbConfigs);
    const server = await Server.init(serverConfigs, database);
    try{
        await server.start();
        console.log('Server running at:', server.info.uri);
    }catch(e){
        console.error('Error starting server:', e);
    }
})();