import * as Mongoose from "mongoose";
import { IDataConfiguration } from "./configurations";
import { IUser, UserModel } from "./features/users/user";
import { ITask, TaskModel } from "./features/tasks/task";

export interface IDatabase {
    userModel: Mongoose.Model<IUser>;
    taskModel: Mongoose.Model<ITask>;
}

export function init(config: IDataConfiguration): IDatabase {

    (<any>Mongoose).Promise = Promise;
    let mongoDb = Mongoose.connection;

    Mongoose.connect(config.connectionString, error => {
        if (error) {
            console.log(`Unable to connect to database: ${config.connectionString}`);
        } else {
            console.log(`Connected to database: ${config.connectionString}`);
        }
    });
    return {
        taskModel: TaskModel,
        userModel: UserModel
    };
}