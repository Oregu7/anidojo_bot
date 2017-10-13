const config = require('config');
const storage = require('dirty')('chapters.db');
const feedparser = require('../../core/feedparser');
const jobFactory = require('../../core/jobFactory');

async function animanga() {
    let animangaList = [
        "http://online.anidub.com/rss.xml",
        "http://animevost.org/rss.xml",
        "http://readmanga.me/rss/index",
        "https://mangaclub.ru/rss.xml"
    ];

    for (let animanga of animangaList) {
        try {
            let chapters = storage.get(animanga); //await feedparser(animanga);
            storage.set(animanga, chapters);
            console.log(animanga, chapters.length);
        } catch (err) {
            console.error(err);
        }
    }

}

module.exports = jobFactory(animanga, 60 * 60);