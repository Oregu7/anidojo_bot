const config = require('config');
const storage = require('dirty')('updates.db');
const getUpdates = require('../../core/getUpdates');
const hashUpdates = require('../../core/hashUpdates');
const prepareChaptersUpdates = require('./prepareChaptersUpdates');
const feedparser = require('../../core/feedparser');
const jobFactory = require('../../core/jobFactory');

async function animanga(sendMessage) {
    let animangaList = config.get('Customer.feedparser.data');
    for (let animanga of animangaList) {
        try {
            let newChapters = (await feedparser(animanga.rss)).slice(animanga.start, animanga.last);
            if (animanga.site == "http://readmanga.me") console.log(newChapters);
            let oldChapters = storage.get(animanga.site) || [];
            if (animanga.site == "http://readmanga.me") console.log(oldChapters.length, oldChapters);
            let updates = getUpdates(oldChapters, newChapters);
            if (updates) {
                let message = prepareChaptersUpdates(animanga, updates);
                sendMessage(message.compile());
                storage.set(animanga.site, hashUpdates(newChapters));
            } else {
                console.info(`${animanga.site} => none`);
            }
        } catch (err) {
            console.error(err);
        }
    }
}

module.exports = jobFactory(animanga, 1000 * 60);