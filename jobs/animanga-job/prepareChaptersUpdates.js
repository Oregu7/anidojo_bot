const { newMessage, createInlineKeyboard } = require('telro').Utils;

module.exports = (animanga, updates) => {
    let text = `\u{1F4E2} *НОВЫЕ ${switchType(animanga.type)('СЕРИИ', 'ГЛАВЫ')}!*
    Сайт: ${animanga.site}
    Тип: ${switchType(animanga.type)('\u{1F3B4}', '\u{1F365}')}\`${animanga.type}\`
    
    \u{1F195} ОБНОВЛЕНИЯ:`;
    let message = newMessage(text);
    message.keyboard = createInlineKeyboard(...updates.newData.map(data => ({ text: data.title, url: data.url })));
    return message;
}

function switchType(type) {
    return (anime, manga) => type === 'anime' ? anime : manga;
}