const { newMessage, createInlineKeyboard } = require('telbot').Utils;

module.exports = (animanga, updates) => {
    //формируем текст сообщения
    let text = `\u{1F4E2} *НОВЫЕ ${switchType(animanga.type)('СЕРИИ', 'ГЛАВЫ')}!*
    Сайт: ${animanga.site}
    Тип: ${switchType(animanga.type)('\u{1F3B4}', '\u{1F365}')}\`${animanga.type}\`
    
    \u{1F195} ОБНОВЛЕНИЯ:`;
    //создаем объект нового сообщения
    let message = newMessage(text);
    //добавляем в message inlineKeyboard, созданную из списка новых глав. 
    //с помощью map меняем поле title на text (в соответсвии с Telegram API) 
    message.keyboard = createInlineKeyboard(...updates.newData.map(data => ({ text: data.title, url: data.url })));
    return message;
}

//простенькая функция, для возврата определенного значения в зависимости от ТИПА данных(manga, anime, ranobe и т.д)
function switchType(type) {
    return (anime, manga) => type === 'anime' ? anime : manga;
}