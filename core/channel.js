const rp = require('request-promise');

const _token = Symbol('token');
const _chatID = Symbol('chatID');
const _baseURL = Symbol('baseURL');
const _send = Symbol('send');

class Channel {
    constructor(token, chatID) {
        this[_token] = token;
        this[_chatID] = chatID;
        this[_baseURL] = `https://api.telegram.org/bot${this[_token]}/`;
    }

    [_send](methodName = '', qs = {}) {
        let url = this[_baseURL] + methodName;
        return rp.get({ uri: url, qs });
    }

    sendMessage({ text, options } = {}) {
        //формируем объект QueryString. Данные в соответствии с Telegram API 
        let qs = Object.assign({}, { chat_id: this[_chatID] }, { text }, options);
        //отправляем запрос и возвращаем объект Promise
        return this[_send]('sendMessage', qs);
    }

    sendPhoto(photo, options = {}) {
        //формируем объект QueryString. Данные в соответствии с Telegram API 
        let qs = Object.assign({}, { chat_id: this[_chatID] }, { photo }, options);
        //отправляем запрос и возвращаем объект Promise
        return this[_send]('sendPhoto', qs);
    }
}

module.exports = Channel;