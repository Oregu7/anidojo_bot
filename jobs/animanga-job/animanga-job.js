const config = require('config');
const storage = require('dirty')('chapters.db');
const checkChaptersUpdates = require('./checkChaptersUpdates');
const feedparser = require('../../core/feedparser');
const jobFactory = require('../../core/jobFactory');

async function animanga() {
    let animangaList = config.get('Customer.feedparser.data');
    for (let animanga of animangaList) {
        try {
            let newChapters = (await feedparser(animanga.rss)).slice(animanga.start, animanga.last);
            let oldChapters = storage.get(animanga.site) || [];
            let result = checkChaptersUpdates(oldChapters, newChapters);
            console.log(result);
            storage.set(animanga.site, newChapters);
        } catch (err) {
            console.error(err);
        }
    }

}

module.exports = jobFactory(animanga, 1000 * 60);