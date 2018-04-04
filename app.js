const pathToDB = "mongodb://localhost/MY";
const DBPort = 8080;
const usersTableName = "users";
const schedulesTableName = "schedules";
const usersTableIsEmptyLog = "Таблица user пуста";
const schedulesTableIsEmptyLog = "Таблица schedules пуста";
const usersTableSizeLog = "Размер таблицы users: ";
const schedulesTableSizeLog = "Размер таблицы schedules: ";
const usersTableDataIsLog = "Содержимое таблицы users: ";
const schedulesTableDataIsLog = "Содержимое таблицы schedules: ";
const usersTableDataRemovedLog = "Таблица users была очищена";
const schedulesTableDataRemovedLog = "Таблица schedules была очищена";
const usersTableDataAfterRemoveLog = "Содержимое таблицы users после очищения: ";
const successfulConnectLog = "УСПЕШНО: Подключение к БД \"MY\" на localhost";

const getAddUserRequestLog = "ПРИНЯТ: GET запрос на добавление пользователЯ: ";
const getAddUsersRequestLog = "ПРИНЯТ: GET запрос на добавление пользователЕЙ: ";
const getAddClassesRequestLog = "ПРИНЯТ: GET запрос на добавление пар: ";
const getAddEmptyClassRequestLog = "ПРИНЯТ: GET запрос на добавление пустой пары";
const getScheduleRequestForExistingUserLog = "ПРИНЯТ: GET запрос на получение расписания для пользователя,\n" +
    "который существовал в таблице users: ";
const getScheduleRequestForNotExistingUserLog = "ПРИНЯТ: GET запрос на получение расписания для пользователя, " +
    "который НЕ существовал в таблице users. Его id: ";
const userAddedLog = "УСПЕШНО: В таблицу users добавлена информация о следующем пользователе:\n";
const userHasAddedLog = "ПРЕДУПРЕЖДЕНИЕ: В таблице users УЖЕ существует информация о таком пользователе: ";

const userFromArrayAddedLog = "УСПЕШНО: В таблицу users добавлена информация о следующем пользователе ИЗ МАССИВА: ";
const userFromArrayHasAddedLog = "ПРЕДУПРЕЖДЕНИЕ: В таблице users УЖЕ существует" +
    " информация о таком пользователе ИЗ МАССИВА: ";

const classFromArrayHasAddedLog = "ПРЕДУПРЕЖДЕНИЕ: Информация о паре из массива УЖЕ существовала в таблице schedules: ";
const thisClassFromArrayAddedLog = "УСПЕШНО: В таблицу schedules добавлена информация о следующей паре\nИЗ МАССИВА: ";

const userAddedStatus = "УСПЕШНО: Информация о Вас добавлена на сервере";
const userDidNotAddedStatus = "ОШИБКА: Информация о Вас НЕ добавлена  на сервер";
const userHasAddedStatus = "ПРЕДУПРЕЖДЕНИЕ: Информация о Вас УЖЕ добавлена на сервере";

const userFromArrayAddedStatus = "УСПЕШНО: Информация о пользователе из массива добавлена на сервер";
const userFromArrayDidNotAddedStatus = "ОШИБКА: Информация о пользователе из массива НЕ добавлена на сервер";
const userFromArrayHasAddedStatus = "ПРЕДУПРЕЖДЕНИЕ: Информация о пользователе из массива УЖЕ существует на сервере";

const friendsAddedStatus = "УСПЕШНО: Информация о Ваших VK друзьях добавлена на сервере";
const friendsDidNotAddedStatus = "ОШИБКА: Информация о Ваших VK друзьях НЕ добавлена на сервере";

const scheduleAddedStatus = "УСПЕШНО: Расписание сохранено на сервере";
const classFromArrayAddedStatus = "УСПЕШНО: Информация о паре из массива добавлена на сервере";
const classFromArrayAddedMockStatus = "УСПЕШНО: Ваше расписание сохранено на сервере";
const classFromArrayDidNotAddedStatus = "ОШИБКА: Информация о паре из массива НЕ добавлена на сервере";
const classFromArrayHasAddedStatus = "ПРЕДУПРЕЖДЕНИЕ: Информация о паре из массива УЖЕ существует на сервере";
const classFromArrayHasAddedMockStatus = "ПРЕДУПРЕЖДЕНИЕ: Такое же расписание УЖЕ существует на сервере";
const classIsEmptyStatus = "ПРЕДУПРЕЖДЕНИЕ: Вы не создали ни одного расписания";
const youDidNotSendYourScheduleStatus = "ПРЕДУПРЕЖДЕНИЕ: Вы не добавили на сервер своих расписаний";

const userDoesNotExistInUsersTableStatus = "ОШИБКА: Информация о Вас отсутствует на сервере";

function consoleLogWithTime(msg) {
    console.log(new Date() + " " + msg)
}

const express = require('express');
const app = express();

app.listen(DBPort);

//подключаем mongoose
const mongoose = require('mongoose');

//подключаемся к таблице user на нашем локальном запущенном экземпляре MongoDB
mongoose.connect(pathToDB, function (error) {
    if (error) throw error;

    consoleLogWithTime(successfulConnectLog + "\n");
});

//создаём схему Юзера
const userSchema = mongoose.Schema({
    id: String,
    vkId: String,
    firstName: String,
    lastName: String,
    universityName: String,
    facultyName: String,
    graduationYear: String,
    courseNumber: String
});

//скомпилируем схему в модель
const UserModel = mongoose.model(usersTableName, userSchema);

function outputUsersTable() {
    UserModel.find({}, function (error, data) {
        if (error) throw error;

        if (data.length === 0)
            consoleLogWithTime(usersTableIsEmptyLog);
        else {
            /*consoleLogWithTime(usersTableSizeLog + data.length);
            consoleLogWithTime(usersTableDataIsLog);
            for (i in data) {
                console.log(data[i].firstName + " " + data[i].lastName);
            }*/
        }
    });
}

function clearUsersTable() {
    UserModel.remove({}, function (err) {
        if (err) {
            consoleLogWithTime(err)
        } else {
            consoleLogWithTime(usersTableDataRemovedLog);
        }
    });
}

// clearUsersTable();

//задаём логику на получение get по ссылке "localhost/users/"
app.get("/" + usersTableName + "/", function (req, res) {
    //распарсиваем в JSON пришедшие данные
    //если придёт список, то хранит Array<Object>,
    //иначе Object
    const result = JSON.parse(req.query.data.toString());

    //хз, что это
    res.writeHead(200, {'Content-Type': 'text/json'});

    if (result.firstName == null) {
        //если пришёл массив
        consoleLogWithTime(getAddUsersRequestLog +
            result[0].firstName + " " + result[0].lastName +
            " и ещё " + (result.length - 1) + " пользователей");

        for (key in result) {
            const userFromArray = result[key];
            // consoleLogWithTime(userFromArray.firstName);

            //создаём объект модели
            const userFromArrayModel = new UserModel(userFromArray);

            //ищем такого пользователя в таблице User
            UserModel.find({id: userFromArray.id}, function (error, data) {
                if (error) return console.error(error);

                //если совпадений не было найдено
                if (data.toString().trim().length === 0) {
                    //сохраняем принятую строку в таблицу
                    userFromArrayModel.save(function (err, data) {
                        //выводим принятую строку в консоль
                        consoleLogWithTime(userFromArrayAddedLog +
                            data.firstName + " " + data.lastName);
                    });
                }
                else {
                    consoleLogWithTime(userFromArrayHasAddedLog +
                        data[0].firstName + " " + data[0].lastName);
                }
            });
        }

        res.end(JSON.stringify({responseData: friendsAddedStatus}));
    }
    else {
        //если пришёл объект
        consoleLogWithTime(getAddUserRequestLog + result.firstName + " " + result.lastName + "\n");

        //создаём объект модели
        const userModel = new UserModel(result);

        const userID = result.vkId;

        //TODO сделать вынесение в константу vkId
        UserModel.find({vkId: userID}, function (error, data) {
            if (error) return console.error(error);

            //если такой юзер не был добавлен на сервер
            if (data.toString().trim().length === 0) {
                //сохраняем принятую строку в таблицу user
                userModel.save(function (err, data) {
                    //выводим принятую строку в консоль
                    consoleLogWithTime(userAddedLog +
                        data.firstName + " " +
                        data.lastName + "\n");

                    if (err)
                    //если произошла ошибка, то отсылаем JSON(?) в таком формате
                        res.end(JSON.stringify({responseData: userDidNotAddedStatus}));
                    else
                    //если всё хорошо, то отсылаем JSON(?) в таком формате
                        res.end(JSON.stringify({responseData: userAddedStatus}));

                    //выводим в консоль всё содержимое таблицы user
                    outputUsersTable();
                });
            }
            else {
                consoleLogWithTime(userHasAddedLog + data[0].firstName + " " + data[0].lastName + "\n");
                res.end(JSON.stringify({responseData: userHasAddedStatus}));

                //выводим в консоль всё содержимое таблицы user
                outputUsersTable();
            }
        });
    }
});

//TODO добавить в схему сервера в таблицу schedules поле со временем, когда расписание было добавлено
//TODO если вдруг у одногруппника расписание поновее или пользователь как-то сам обновил

//создаём схему Юзера
const classSchema = mongoose.Schema({
    userID: String,
    dayOfWeek: Number,
    classBeginTime: String,
    classEndTime: String,
    classType: String,
    className: String,
    roomName: String,
    teacherName: String,
    classSerialNumber: String,
    scheduleCreationTime: String
});

//скомпилируем схему в модель
const ClassModel = mongoose.model(schedulesTableName, classSchema);

function outputSchedulesTable() {
    ClassModel.find({}, function (error, data) {
        if (data.length === 0) {
            consoleLogWithTime("\n" + schedulesTableIsEmptyLog + "\n");
        }
        else {
            consoleLogWithTime("\n" + schedulesTableSizeLog + data.length);
            consoleLogWithTime(schedulesTableDataIsLog);
            for (i in data)
                consoleLogWithTime(getDayOfWeekName(data[i].dayOfWeek) + " " + data[i].classSerialNumber);

            // consoleLogWithTime("\n")
        }
    });
}

function clearSchedulesTable() {
    ClassModel.remove({}, function (err) {
        if (err) {
            consoleLogWithTime(err)
        } else {
            consoleLogWithTime(schedulesTableDataRemovedLog);
        }
    });
}

function getDayOfWeekName(dayOfWeekValue) {
    switch (dayOfWeekValue) {
        case 0:
            return "Monday";
        case 1:
            return "Tuesday";
        case 2:
            return "Wednesday";
        case 3:
            return "Thursday";
        case 4:
            return "Friday";
        case 5:
            return "Saturday";
    }
}

function removeUserSchedule(query) {
    ClassModel.remove(query, function (err) {
        if (err) {
            consoleLogWithTime(err)
        } else {
            consoleLogWithTime("Пришёл запрос на сохранение расписания пользователя.\nИ для этого его расписание было очищено ");
        }
    });
}

function saveUserSchedule(schedule) {
    for (key in schedule) {
        const classFromArray = schedule[key];

        //создаём объект модели
        const classFromArrayModel = new ClassModel(classFromArray);

        classFromArrayModel.save(function (err, data) {
            //выводим принятую строку в консоль
            if (err) {
                consoleLogWithTime(err)
            } else {
                consoleLogWithTime(thisClassFromArrayAddedLog +
                    getDayOfWeekName(data.dayOfWeek) + " " +
                    data.classSerialNumber + " " +
                    data.className + ", user id: " + data.userID);
            }
        });
    }
}

// outputSchedulesTable();

app.get("/" + schedulesTableName + "/", function (req, res) {
    //распарсиваем в JSON пришедшие данные
    //если придёт список, то хранит Array<Object>,
    //иначе Object
    const result = JSON.parse(req.query.data.toString());

    res.writeHead(200, {'Content-Type': 'text/json'});

    if (result.id == null) {
        if (result.length > 0) {
            //пришёл запрос на сохранение расписания пользователя на сервере
            consoleLogWithTime(getAddClassesRequestLog
                + getDayOfWeekName(result[0].dayOfWeek) + " " + result[0].classSerialNumber +
                " и ещё " + (result.length - 1) + " пар\n");

            removeUserSchedule({userID: result[0].userID});

            saveUserSchedule(result);

            // outputSchedulesTable();

            res.end(JSON.stringify({responseData: scheduleAddedStatus}));
        }
        else if (result.length === 0) {
            //если пользователь не создал расписаний и отправил запрос на сохранение
            consoleLogWithTime(getAddEmptyClassRequestLog);
            res.end(JSON.stringify({responseData: classIsEmptyStatus}));
        }
    }
    else {
        //пришёл запрос на получение расписания от пользователя
        UserModel.find({vkId: result.id}, function (error, data) {

            if (error) return console.error(error);

            if (data.toString().trim().length !== 0) {

                const user = data[0];
                //сюда заходит, если пришёл запрос на получение расписания от пользователя,
                //который есть в таблице users
                consoleLogWithTime("\n" + getScheduleRequestForExistingUserLog + user.firstName + " " + user.lastName);

                const user_ID = user.vkId;

                ClassModel.find({userID: user_ID}, function (error, data) {
                    if (data.length === 0) {
                        consoleLogWithTime("\nВ таблице schedules нет расписаний для такого пользователя" +
                            "\n(Мб он не присылал расписаний?)" + "\n");
                        res.end(JSON.stringify({responseData: youDidNotSendYourScheduleStatus}));
                    }
                    else {
                        consoleLogWithTime("Для такого пользователя найдены такие пары: ");
                        for (i in data)
                            consoleLogWithTime(getDayOfWeekName(data[i].dayOfWeek) + " " + data[i].classSerialNumber);

                        res.end(JSON.stringify({responseData: JSON.stringify(data)}));

                        consoleLogWithTime("Пользователю отправлено его расписание")
                        // consoleLogWithTime("\n")
                    }
                });
            }
            else {
                //если такого пользователя нет в таблице users
                consoleLogWithTime(getScheduleRequestForNotExistingUserLog + result.id);
                res.end(JSON.stringify({responseData: userDoesNotExistInUsersTableStatus}));
            }
        });
    }
});