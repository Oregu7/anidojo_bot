const FeedParser = require('feedparser');
const config = require('config');
const request = require('request'); // for fetching the feed

/*
    получаем данные из rss-ленты
    @url [string] - ссылка на rss-ленту из которой будут доставаться данные
    @desc [boolean] - опциональный параметр. Отвечает за добавление свойства description в item list (по умолчанию title, url) 
*/
module.exports = (url, desc = false) => {
    return new Promise((resolve, reject) => {
        let result = [];
        let req = request({
            uri: url,
            headers: config.get('Customer.feedparser.headers')
        });
        let feedparser = new FeedParser();

        req.on('error', function(error) {
            console.error(error);
            reject(error);
        });

        req.on('response', function(res) {
            let stream = this;
            if (res.statusCode !== 200) {
                console.log(res.statusCode);
                stream.emit('error', new Error('Bad status code'));
            } else {
                stream.pipe(feedparser);
            }
        });

        feedparser.on('error', function(error) {
            console.error(error);
            reject(error);
        });

        feedparser.on('readable', function() {
            var item;
            let stream = this; // `this` is `feedparser`, which is a stream
            while (item = stream.read()) {
                let chapter = { title: item.title, url: item.link };
                if (desc) chapter.description = item.description;
                result.push(chapter);
            };
        });

        feedparser.on('end', () => {
            resolve(result);
        });
    });
}