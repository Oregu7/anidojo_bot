const _ = require("lodash");

//Фабрика по созданию работ, замыкаем callback и time и возращаем новую Job-function.
module.exports = (callback, time = 1000) => (...arguments) => {
    //проверка типов, callback === Function, time === Integer
    if (!_.isFunction(callback) && _.isInteger(time)) throw new Error("Bad arguments types! callbakc => [Function], time => [Number]");
    //инициализируем новый интервал, и возращаем его ссылку.
    let interval = setInterval(callback, time, ...arguments);
    return interval;
}