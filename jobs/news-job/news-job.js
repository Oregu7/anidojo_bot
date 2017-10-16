const config = require('config');
const storage = require('dirty')('updates.db');
const getUpdates = require('../../core/getUpdates');
const hashUpdates = require('../../core/hashUpdates');
const feedparser = require('../../core/feedparser');
const jobFactory = require('../../core/jobFactory');
const prepareUpdatedPosts = require('./prepareUpdatedPosts');

async function news(sendMessage) {
    //линка на feed с новостями
    let link = "http://anidub.com/feed/";
    //получаем список новостей из ленты, в данные будет включено поле description, из-за feedparser(_, true) 
    let postsList = await feedparser(link, true);
    //получаем список предыдущих новостей
    let oldPosts = storage.get(link) || [];
    //получаем новые посты
    let updates = getUpdates(oldPosts, postsList);
    //если он есть...
    if (updates) {
        try {
            //подготавливаем и отправляем новые посты
            prepareUpdatedPosts(sendMessage, updates);
            //обновляем хэши(hashUpdates) полученных новостей
            storage.set(link, hashUpdates(postsList));
        } catch (err) {
            console.log(err);
        }
    } else {
        console.info(`${link}[news] => none`);
    }
}

//экспортируем новую работу
module.exports = jobFactory(news, config.get("Customer.jobs.news.time"));