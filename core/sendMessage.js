const rp = require('request-promise');

//Замыкаем токен бота и нужный чат-ID. Возвращаем функцию для отправки сообщений
module.exports = (token, chatID) => ({ text, options } = {}) => {
    //линка на api, метод sendMessage
    let url = `https://api.telegram.org/bot${token}/sendMessage`;
    //формируем объект QueryString. Данные в соответствии с Telegram API 
    let qs = Object.assign({}, { chat_id: chatID }, { text }, options);
    //отправляем запрос и возвращаем объект Promise
    return rp.get({ uri: url, qs });
}