import * as Database from "../src/database";


export function createTaskDummy(userId?: string, name?: string, description?: string) {
    var user = {
        name: name || "dummy task",
        description: description || "I'm a dummy task!"
    };

    if (userId) {
        user["userId"] = userId;
    }

    return user;
}

export function createUserDummy(email?: string) {
    var user = {
        email: email || "dummy@mail.com",
        name: "Dummy Jones",
        password: "123123"
    };

    return user;
}


export function clearDatabase(database: Database.IDatabase) {
    var promiseUser = database.userModel.remove({});
    var promiseTask = database.taskModel.remove({});

    return Promise.all([promiseUser, promiseTask]);
}

export function createSeedTaskData(database: Database.IDatabase) {
    return database.userModel.create(createUserDummy())
        .then((user) => {
            return Promise.all([
                database.taskModel.create(createTaskDummy(user._id, "Task 1", "Some dummy data 1")),
                database.taskModel.create(createTaskDummy(user._id, "Task 2", "Some dummy data 2")),
                database.taskModel.create(createTaskDummy(user._id, "Task 3", "Some dummy data 3")),
            ]);
        });
}

export function createSeedUserData(database: Database.IDatabase) {
    return database.userModel.create(createUserDummy());
}

