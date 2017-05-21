import { SpecHelper } from './../test.helpers';
import { IDatabase } from './../../src/database';
import { assert } from "chai";
import TaskController from "../../src/features/tasks/task-controller";
import { ITask } from "../../src/features/tasks/task";
import { IUser } from "../../src/features/users/user";
import * as Utils from "../utils";
import * as Hapi from 'hapi';

let server:Hapi.Server;
let database:IDatabase;
describe("TastController Tests", () => {

    before(async () => {
        const helper = new SpecHelper();
        await helper.start();
        server = helper.server;
        database = helper.database;
    });
    describe('Test controller', () => {
        beforeEach(async () => {
            await Utils.createSeedTaskData(database);
        });
        afterEach(async () => {
            await Utils.clearDatabase(database);
        });

        it("Get tasks", (done) => {
            var user = Utils.createUserDummy();

            server.inject({ method: 'POST', url: '/users/login', payload: { email: user.email, password: user.password } }, (res) => {
                assert.equal(200, res.statusCode);
                var login: any = JSON.parse(res.payload);

                server.inject({ method: 'Get', url: '/tasks', headers: { "authorization": login.token } }, (res) => {
                    assert.equal(200, res.statusCode);
                    var responseBody: Array<ITask> = JSON.parse(res.payload);
                    assert.equal(3, responseBody.length);
                    done();
                });
            });
        });

        it("Get single task", (done) => {
            var user = Utils.createUserDummy();

            server.inject({ method: 'POST', url: '/users/login', payload: { email: user.email, password: user.password } }, (res) => {
                assert.equal(200, res.statusCode);
                var login: any = JSON.parse(res.payload);

                database.taskModel.findOne({}).then((task) => {
                    server.inject({ method: 'Get', url: '/tasks/' + task._id, headers: { "authorization": login.token } }, (res) => {
                        assert.equal(200, res.statusCode);
                        var responseBody: ITask = JSON.parse(res.payload);
                        assert.equal(task.name, responseBody.name);
                        done();
                    });
                });
            });
        });

        it("Create task", (done) => {
            var user = Utils.createUserDummy();

            server.inject({ method: 'POST', url: '/users/login', payload: { email: user.email, password: user.password } }, (res) => {
                assert.equal(200, res.statusCode);
                var login: any = JSON.parse(res.payload);

                database.userModel.findOne({ email: user.email }).then((user: IUser) => {
                    var task = Utils.createTaskDummy();

                    server.inject({ method: 'POST', url: '/tasks', payload: task, headers: { "authorization": login.token } }, (res) => {
                        assert.equal(201, res.statusCode);
                        var responseBody: ITask = <ITask>JSON.parse(res.payload);
                        assert.equal(task.name, responseBody.name);
                        assert.equal(task.description, responseBody.description);
                        done();
                    });
                });
            });
        });

        it("Update task", (done) => {
            var user = Utils.createUserDummy();

            server.inject({ method: 'POST', url: '/users/login', payload: { email: user.email, password: user.password } }, (res) => {
                assert.equal(200, res.statusCode);
                var login: any = JSON.parse(res.payload);

                database.taskModel.findOne({}).then((task) => {

                    var updateTask = {
                        completed: true,
                        name: task.name,
                        description: task.description
                    };

                    server.inject({ method: 'PUT', url: '/tasks/' + task._id, payload: updateTask, headers: { "authorization": login.token } },
                        (res) => {
                            assert.equal(200, res.statusCode);
                            //console.log(res.payload);
                            var responseBody: ITask = JSON.parse(res.payload);
                            assert.isTrue(responseBody.completed);
                            done();
                        });
                });
            });
        });

        it("Delete single task", (done) => {
            var user = Utils.createUserDummy();

            server.inject({ method: 'POST', url: '/users/login', payload: { email: user.email, password: user.password } }, (res) => {
                assert.equal(200, res.statusCode);
                var login: any = JSON.parse(res.payload);

                database.taskModel.findOne({}).then((task) => {
                    server.inject({ method: 'DELETE', url: '/tasks/' + task._id, headers: { "authorization": login.token } }, (res) => {
                        assert.equal(200, res.statusCode);
                        var responseBody: ITask = JSON.parse(res.payload);
                        assert.equal(task.name, responseBody.name);

                        database.taskModel.findById(responseBody._id).then((deletedTask) => {
                            assert.isNull(deletedTask);
                            done();
                        });
                    });
                });
            });
        });
    });
});
