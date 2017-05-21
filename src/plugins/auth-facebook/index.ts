import { IPlugin, IPluginOptions } from "../interfaces";
import * as Hapi from "hapi";

export default (): IPlugin => {
    return {
        register: (server: Hapi.Server, options: IPluginOptions) => {
            let { database, serverConfigs } = options;
            server.register(require('bell'), error => {
                if (error) {
                    console.log('Facebook auth error', error);
                } else {
                    server.auth.strategy('facebook', 'bell', {
                        provider: 'facebook',
                        password: 'cookie_encryption_password_secure',
                        clientId: 'my_twitter_client_id',
                        clientSecret: 'my_twitter_client_secret',
                        isSecure: false     // Terrible idea but required if not using HTTPS especially if developing locally
                    });
                }
            });
        },
        info: () => {
            return {
                name: 'Oauth (Facebook)',
                version: '1.0.0'
            }
        }
    }
}