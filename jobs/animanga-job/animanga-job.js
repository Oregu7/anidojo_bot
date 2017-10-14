const config = require('config');
const storage = require('dirty')('chapters.db');
const getChaptersUpdates = require('./getChaptersUpdates');
const prepareChaptersUpdates = require('./prepareChaptersUpdates');
const feedparser = require('../../core/feedparser');
const jobFactory = require('../../core/jobFactory');

async function animanga(sendMessage) {
    let animangaList = config.get('Customer.feedparser.data');
    for (let animanga of animangaList) {
        try {
            let newChapters = (await feedparser(animanga.rss)).slice(animanga.start, animanga.last);
            let oldChapters = storage.get(animanga.site) || [];
            let updates = getChaptersUpdates(oldChapters, newChapters);
            if (updates) {
                let message = prepareChaptersUpdates(animanga, updates);
                sendMessage(message.compile());
            } else {
                console.info(`${animanga.site} => none`);
            }
            storage.set(animanga.site, newChapters);
        } catch (err) {
            console.error(err);
        }
    }
}

module.exports = jobFactory(animanga, 1000 * 60);