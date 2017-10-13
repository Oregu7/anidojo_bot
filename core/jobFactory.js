const _ = require("lodash");

module.exports = (callback, time = 1000) => (...arguments) => {
    if (!_.isFunction(callback) && _.isInteger(time)) throw new Error("Bad arguments types! callbakc => [Function], time => [Number]");
    let interval = setInterval(callback, time, ...arguments);
    return interval;
}