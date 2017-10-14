const { newMessage, createInlineKeyboard } = require('telro').Utils;

module.exports = (animanga, updates) => {
    let text = `\u{1F4E2} *НОВЫЕ ${animanga.type === 'anime' ? 'СЕРИИ' : 'ГЛАВЫ'}!*
    Сайт: ${animanga.site}
    Тип: \`${animanga.type}\``;
    let message = newMessage(text);
    message.keyboard = createInlineKeyboard(...updates.newData.map(data => ({ text: data.title, url: data.url })));
    return message;
}