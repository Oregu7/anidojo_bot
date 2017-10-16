const mongoose = require('mongoose');
const jobs = require('./jobs');
//initialize
require('dotenv').config();
mongoose.Promise = global.Promise;
mongoose.connect(process.env.DB_TOKEN, {
    keepAlive: true,
    reconnectTries: Number.MAX_VALUE,
    useMongoClient: true
});
const sendMessage = require("./core/sendMessage")(process.env.BOT_TOKEN, process.env.CHAT_ID);
jobs.start(sendMessage);