const mongoose = require('mongoose');
const Channel = require('./core/channel');
const jobs = require('./jobs');
//initialize
require('dotenv').config();
mongoose.Promise = global.Promise;
mongoose.connect(process.env.DB_TOKEN, {
    keepAlive: true,
    reconnectTries: Number.MAX_VALUE,
    useMongoClient: true
});
const channel = new Channel(process.env.BOT_TOKEN, process.env.CHAT_ID);
jobs.start(channel);