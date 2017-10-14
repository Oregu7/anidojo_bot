const jobs = require("./jobs");
//initialize
require("dotenv").config();
const sendMessage = require("./core/sendMessage")(process.env.BOT_TOKEN, process.env.CHAT_ID);
jobs.start(sendMessage);