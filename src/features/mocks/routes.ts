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
    });
    server.route({
        method: ['GET', 'POST'], // Must handle both GET and POST
        path: '/login',          // The callback endpoint registered with the provider
        config: {
            auth: 'facebook',
            handler: function (request, reply) {

                if (!request.auth.isAuthenticated) {
                    return reply('Authentication failed due to: ' + request.auth.error.message);
                }

                // Perform any account lookup or registration, setup local session,
                // and redirect to the application. The third-party credentials are
                // stored in request.auth.credentials. Any query parameters from
                // the initial request are passed back via request.auth.credentials.query.
                return reply.redirect('/mocks');
            }
        }
    });
}