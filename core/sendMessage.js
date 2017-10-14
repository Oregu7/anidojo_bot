const rp = require('request-promise');

module.exports = (token, chatID) => ({ text, options } = {}) => {
    let url = `https://api.telegram.org/bot${token}/sendMessage`;
    let qs = Object.assign({}, { chat_id: chatID }, { text }, options);
    return rp.get({ uri: url, qs });
}