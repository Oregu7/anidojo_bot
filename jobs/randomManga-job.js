const config = require('config');
const { createInlineKeyboard, newMessage } = require("telbot").Utils;
const rp = require('request-promise');
const cheerio = require("cheerio");
const jobFactory = require('../core/jobFactory');

//отправляем get-запрос на заданный [ url ] и парсим тело ответа с помощью cheerio.
function scrapManga(url) {
    return rp.get({
        uri: url,
        transform: (body) => cheerio.load(body)
    });
}

//получаем случайную мангу, парсим и возвращаем данные в структурированном виде
async function getRandomMangaFromReadManga() {
    //получаем объект cheerio
    const $ = await scrapManga("http://readmanga.me/internal/random");
    //парсим данные
    let manga = $("#mangaBox .leftContent");
    let alternativeTitle = manga.find("meta[itemprop='name']").attr("content");
    let title = manga.find("meta[itemprop='alternativeHeadline']").attr("content");
    let url = manga.find("meta[itemprop='url']").attr("content");
    let description = manga.find("meta[itemprop='description']").attr("content");
    let image = manga.find("div.picture-fotorama").children("img").first().attr("src");

    return { title, alternativeTitle, url, description, image };
}

async function randomManga(channel) {
    //получаем рандомную мангу
    const manga = await getRandomMangaFromReadManga();
    //формируем текст сообщения
    let text = `*${ manga.title }*\n_${ manga.alternativeTitle }_
    [\u{2063}](${manga.image})
    ${manga.description}`;
    //создаем новый объект message
    let message = newMessage(text);
    //добавляем inlineKeyboard (одну кнопку - [ссылку], т.к используем свойство [ url ])
    message.keyboard = createInlineKeyboard({ text: "\u{1F4DC}Читать", url: manga.url });
    //отправляем message в чат
    channel.sendMessage(message.compile());
}

//экспортируем новую работу
module.exports = jobFactory(randomManga, config.get("Customer.jobs.randomManga.time"));