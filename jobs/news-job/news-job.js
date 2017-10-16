const config = require('config');
const storage = require('dirty')('updates.db');
const getUpdates = require('../../core/getUpdates');
const hashUpdates = require('../../core/hashUpdates');
const feedparser = require('../../core/feedparser');
const jobFactory = require('../../core/jobFactory');
const prepareUpdatedPosts = require('./prepareUpdatedPosts');

async function news(sendMessage) {
    let link = "http://anidub.com/feed/";
    let postsList = await feedparser(link, true);
    let oldPosts = storage.get(link) || [];
    let updates = getUpdates(oldPosts, postsList);
    if (updates) {
        try {
            prepareUpdatedPosts(sendMessage, updates);
            storage.set(link, hashUpdates(postsList));
        } catch (err) {
            console.log(err);
        }
    } else {
        console.info(`${link}[news] => none`);
    }
}

module.exports = jobFactory(news, 70 * 1000);