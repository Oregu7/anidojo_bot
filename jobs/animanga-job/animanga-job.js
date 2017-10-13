const config = require('config');
const storage = require('dirty')('chapters.db');
const getChaptersUpdates = require('./getChaptersUpdates');
const prepareChaptersUpdates = require('./prepareChaptersUpdates');
const feedparser = require('../../core/feedparser');
const jobFactory = require('../../core/jobFactory');

async function animanga() {
    let animangaList = config.get('Customer.feedparser.data');
    for (let animanga of animangaList) {
        try {
            let newChapters = (await feedparser(animanga.rss)).slice(animanga.start, animanga.last);
            let oldChapters = storage.get(animanga.site) || [];
            prepareChaptersUpdates(animanga.site, getChaptersUpdates(oldChapters, newChapters));
            storage.set(animanga.site, newChapters);
        } catch (err) {
            console.error(err);
        }
    }
}

module.exports = jobFactory(animanga, 1000 * 60);