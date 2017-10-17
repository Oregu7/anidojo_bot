const config = require('config');
const randAniWall = require('random-anime-wallpapers');
const { createInlineKeyboard, newMessage } = require("telro").Utils;
const choice = require('../core/choice');
const jobFactory = require('../core/jobFactory');

async function randomAnimeWallpapers(channel) {
    //let genre = choice(config.get("Customer.jobs.randomAnimeWallpapers.genres"));
    let wallpaper = (await randAniWall())[0];
    let keyboard = createInlineKeyboard({ text: "\u{1F5BC}FULL", url: wallpaper.full });
    let caption = `НОВЫЕ ОБОИ\n#anidojo #anime_wallpapers #${wallpaper.id}`;
    let options = Object.assign({}, { caption }, keyboard);
    //отправляем message в чат
    console.log(wallpaper);
    channel.sendPhoto(wallpaper.thumb, options);
}

module.exports = jobFactory(randomAnimeWallpapers, config.get("Customer.jobs.randomAnimeWallpapers.time"));