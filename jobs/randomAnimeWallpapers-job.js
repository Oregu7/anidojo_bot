const config = require('config');
const rp = require('request-promise');
const randAniWall = require('random-anime-wallpapers');
const { createInlineKeyboard, newMessage } = require("telro").Utils;
const choice = require('../core/choice');
const jobFactory = require('../core/jobFactory');

async function animeWallpapers(channel) {
    let wallpaper = await getRandomAnimeWallpapers();
    let keyboard = createInlineKeyboard({ text: "\u{1F5BC}FULL", url: wallpaper.full });
    let caption = `НОВЫЕ ОБОИ\n#anidojo #anime_wallpapers #${wallpaper.id}`;
    let options = Object.assign({}, { caption }, keyboard);
    //отправляем message в чат
    console.log(wallpaper);
    channel.sendPhoto(wallpaper.thumb, options);
}

async function getRandomAnimeWallpapers() {
    let wallpapers = await randAniWall();
    for (let wallpaper of wallpapers) {
        try {
            let res = await rp.get(wallpaper.full);
            return wallpaper;
        } catch (err) {
            continue;
        }
    }
    return await getAnimeWallpapers();
}

module.exports = jobFactory(animeWallpapers, config.get("Customer.jobs.randomAnimeWallpapers.time"));