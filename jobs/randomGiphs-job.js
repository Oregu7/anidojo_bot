const config = require('config');
const rp = require('request-promise');
const jobFactory = require('../core/jobFactory');

const URL = `https://api.giphy.com/v1/gifs/random?api_key=${process.env.GIPHY_API}&tag=anime&rating=G`;

async function randomGiphs(channel) {
    try {
        let caption = `#anidojo #anime_gifs`;
        let { data: { image_original_url } } = JSON.parse(await rp.get(URL));
        channel.sendDocument(image_original_url, { caption });
    } catch (err) {
        console.error(err);
    }
}

module.exports = jobFactory(randomGiphs, config.get("Customer.jobs.randomGiphs.time"));