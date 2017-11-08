const { newMessage, createInlineKeyboard } = require('telbot').Utils;
const cheerio = require('cheerio');
const htmlToText = require('html-to-text');

function prepareUpdatedPosts(channel, updates) {
    for (post of updates.newData) {
        //парсим описание постов с помощью cheerio
        let $ = cheerio.load(post.description);
        let img = $("img").attr("src");
        //основные данные поста находятся в первой таблице и последнем tr
        let postData = $("table").first().find("tbody>tr:last-child>td");
        let categories = postData.find("p").first().find("a").map((indx, el) => $(el).text()).get();
        let tags = postData.find("p").eq(1).find("a").map((indx, el) => $(el).text()).get();
        //после получения данных, удаляем параграфы(p)
        postData.find("p").remove();
        //получаем непосредственно описание
        let description = htmlToText.fromString(postData.text());
        //формируем message
        const message = getPostMessage({
            title: post.title,
            url: post.url,
            img,
            categories,
            tags,
            description
        });
        //отправляем message в чат
        channel.sendMessage(message.compile());
    }
}

function getPostMessage(post) {
    //формируем текст сообщения
    let text = `\u{1F4F0} *${post.title}*
    Категории: ${post.categories.join(", ")}
    Тэги: ${post.tags.join(", ")}
    [\u{2063}](${post.img})
    ${post.description}`;
    //создаем новый объект message
    let message = newMessage(text);
    //добавляем inlineKeyboard
    message.keyboard = createInlineKeyboard({ text: "\u{1F4DC}Читать", url: post.url });
    return message;
}

module.exports = prepareUpdatedPosts;