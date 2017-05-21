import * as chai from "chai";
import UserController from "../../src/features/users/user-controller";
import { IUser } from "../../src/features/users/user";
import * as Configs from "../../src/configurations";
import * as Server from "../../src/server";
import * as Database from "../../src/database";
import * as Utils from "../utils";

const configDb = Configs.getDatabaseConfig();
let database;
const assert = chai.assert;
const serverConfig = Configs.getServerConfigs();
let server;

xdescribe("UserController Tests", () => {

    beforeEach(async() => {
        database = Database.init(configDb);
        server = await Server.init(serverConfig, database);
        await server.start();
        await Utils.createSeedUserData(database);
    });

    afterEach(async() => {
        await Utils.clearDatabase(database);
    });

    it("Create user", (done) => {
        var user = {
            email: "user@mail.com",
            name: "John Robot",
            password: "123123"
        };

        server.inject({ method: 'POST', url: '/users', payload: user }, (res) => {
            assert.equal(201, res.statusCode);
            var responseBody: any = JSON.parse(res.payload);
            assert.isNotNull(responseBody.token);
            done();
        });
    });

    it("Create user invalid data", (done) => {
        var user = {
            email: "user",
            name: "John Robot",
            password: "123123"
        };

        server.inject({ method: 'POST', url: '/users', payload: user }, (res) => {
            assert.equal(400, res.statusCode);
            done();
        });
    });

    it("Create user with same email", (done) => {
        server.inject({ method: 'POST', url: '/users', payload: Utils.createUserDummy() }, (res) => {
            assert.equal(500, res.statusCode);
            done();
        });
    });

    it("Get user Info", (done) => {
        var user = Utils.createUserDummy();

        server.inject({ method: 'POST', url: '/users/login', payload: { email: user.email, password: user.password } }, (res) => {
            assert.equal(200, res.statusCode);
            var login: any = JSON.parse(res.payload);

            server.inject({ method: 'GET', url: '/users/info', headers: { "authorization": login.token } }, (res) => {
                assert.equal(200, res.statusCode);
                var responseBody: IUser = <IUser>JSON.parse(res.payload);
                assert.equal(user.email, responseBody.email);
                done();
            });
        });
    });

    it("Get User Info Unauthorized", (done) => {
        server.inject({ method: 'GET', url: '/users/info', headers: { "authorization": "dummy token" } }, (res) => {
            assert.equal(401, res.statusCode);
            done();
        });
    });


    it("Delete user", (done) => {
        var user = Utils.createUserDummy();

        server.inject({ method: 'POST', url: '/users/login', payload: { email: user.email, password: user.password } }, (res) => {
            assert.equal(200, res.statusCode);
            var login: any = JSON.parse(res.payload);

            server.inject({ method: 'DELETE', url: '/users', headers: { "authorization": login.token } }, (res) => {
                assert.equal(200, res.statusCode);
                var responseBody: IUser = <IUser>JSON.parse(res.payload);
                assert.equal(user.email, responseBody.email);

                database.userModel.findOne({ "email": user.email }).then((deletedUser) => {
                    assert.isNull(deletedUser);
                    done();
                });
            });
        });
    });

    it("Update user info", (done) => {
        var user = Utils.createUserDummy();

        server.inject({ method: 'POST', url: '/users/login', payload: { email: user.email, password: user.password } }, (res) => {
            assert.equal(200, res.statusCode);
            var login: any = JSON.parse(res.payload);
            var updateUser = { name: "New Name" };

            server.inject({ method: 'PUT', url: '/users', payload: updateUser, headers: { "authorization": login.token } }, (res) => {
                assert.equal(200, res.statusCode);
                var responseBody: IUser = <IUser>JSON.parse(res.payload);
                assert.equal("New Name", responseBody.name);
                done();
            });
        });
    });
});
