const feedparser = require("../core/feedparser");

module.exports = () => {
    let animangaList = [
        "http://online.anidub.com/rss.xml",
        "https://anistar.me/rss.xml",
        "http://readmanga.me/rss/index",
        "https://mangaclub.ru/rss.xml"
    ];
    setInterval(() => {
        for (let animanga of animangaList) {
            feedparser(animanga).then(console.log)
        }
    }, 60 * 60);
}