const config = require('config');
const storage = require('dirty')('updates.db');
const getUpdates = require('../../core/getUpdates');
const hashUpdates = require('../../core/hashUpdates');
const prepareChaptersUpdates = require('./prepareChaptersUpdates');
const updateDataFromDB = require('./updateDataFromDB');
const feedparser = require('../../core/feedparser');
const jobFactory = require('../../core/jobFactory');

async function animanga(sendMessage) {
    //получаем список сайтов, на которые мы подписаны
    let animangaList = config.get('Customer.feedparser.data');
    for (let animanga of animangaList) {
        try {
            //получаем главы из rss-ленты и выбираем определенный slice (в соответсвит с конфигом)
            let newChapters = (await feedparser(animanga.rss)).slice(animanga.start, animanga.last);
            //достаем из базы предыдущие главы
            let oldChapters = storage.get(animanga.site) || [];
            //получаем новые обновления
            let updates = getUpdates(oldChapters, newChapters);
            //если они есть, то
            if (updates) {
                //если мы получили обновления, то готовим message для отправки
                let message = prepareChaptersUpdates(animanga, updates);
                //отправляем message в чат
                sendMessage(message.compile());
                //обновляем данные в MongoDB(для vk-бота) и в локальном storage (хэши - hashUpdates)
                updateDataFromDB(animanga, newChapters);
                storage.set(animanga.site, hashUpdates(newChapters));
            } else {
                console.info(`${animanga.site} => none`);
            }
        } catch (err) {
            console.error(err);
        }
    }
}

//экспортируем новую работу
module.exports = jobFactory(animanga, config.get("Customer.jobs.animanga.time"));