const { createInlineKeyboard, newMessage } = require("telro").Utils;
const rp = require('request-promise');
const cheerio = require("cheerio");
const jobFactory = require('../core/jobFactory');

function scrapManga(url) {
    return rp.get({
        uri: url,
        transform: (body) => cheerio.load(body)
    });
}

async function getRandomMangaFromReadManga() {
    const $ = await scrapManga("http://readmanga.me/internal/random");
    let manga = $("#mangaBox .leftContent");
    let alternativeTitle = manga.find("meta[itemprop='name']").attr("content");
    let title = manga.find("meta[itemprop='alternativeHeadline']").attr("content");
    let url = manga.find("meta[itemprop='url']").attr("content");
    let description = manga.find("meta[itemprop='description']").attr("content");
    let image = manga.find("div.picture-fotorama").children("img").first().attr("src");

    return { title, alternativeTitle, url, description, image };
}

async function randomManga(sendMessage) {
    const manga = await getRandomMangaFromReadManga();
    let text = `*${ manga.title }*\n_${ manga.alternativeTitle }_
    [\u{2063}](${manga.image})
    ${manga.description}`;
    let message = newMessage(text);
    message.keyboard = createInlineKeyboard({ text: "\u{1F4DC}Читать", url: manga.url });
    sendMessage(message.compile());
}

module.exports = jobFactory(randomManga, 1000 * 60 * 2);