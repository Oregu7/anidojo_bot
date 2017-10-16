const { newMessage, createInlineKeyboard } = require('telro').Utils;
const cheerio = require('cheerio');

function prepareUpdatedPosts(sendMessage, updates) {
    for (post of updates.newData) {
        let $ = cheerio.load(post.description);
        let img = $("img").attr("src");
        let postData = $("table").first().find("tbody>tr:last-child>td");
        let categories = postData.find("p").first().find("a").map((indx, el) => $(el).text()).get();
        let tags = postData.find("p").eq(1).find("a").map((indx, el) => $(el).text()).get();
        postData.find("p").remove();
        let description = postData.text();
        const message = getPostMessage({
            title: post.title,
            url: post.url,
            img,
            categories,
            tags,
            description
        });
        sendMessage(message.compile());
    }
}

function getPostMessage(post) {
    let text = `*${post.title}*
    Категории: ${post.categories.join(", ")}
    Тэги: ${post.tags.join(", ")}
    [\u{2063}](${post.img})
    ${post.description}`;
    let message = newMessage(text);
    message.keyboard = createInlineKeyboard({ text: "\u{1F4DC}Читать", url: post.url });
    return message;
}

module.exports = prepareUpdatedPosts;