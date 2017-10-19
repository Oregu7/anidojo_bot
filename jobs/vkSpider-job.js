const config = require('config');
const rp = require('request-promise');
const storage = require('dirty')('updates.db');
const htmlToText = require('html-to-text');
const { createInlineKeyboard, newMessage } = require("telro").Utils;
const getUpdates = require('../core/getUpdates');
const hashUpdates = require('../core/hashUpdates');
const choice = require('../core/choice');
const jobFactory = require('../core/jobFactory');

async function vkSpider(channel) {
    let domain = "anime";
    let posts = await getPosts(domain);
    if (posts) prepareVKPosts(channel, domain, posts);
}

async function getPosts(domain, count = 15) {
    const baseURL = `https://api.vk.com/method/wall.get`;
    let qs = {
        domain,
        count,
        filter: "owner",
        access_token: process.env.SERVICE_KEY
    };
    try {
        let { response } = JSON.parse(await rp.get({ uri: baseURL, qs }));
        return response.map(item => {
            let url = `https://vk.com/${domain}/post-${item.id}`;
            return Object.assign({}, item, { url });
        });
    } catch (err) {
        console.error(err);
        return false;
    }
}

function prepareVKPosts(channel, domain, posts) {
    const link = `https://vk.com/${domain}/`;
    let oldPosts = storage.get(link) || [];
    let updates = getUpdates(oldPosts, posts);
    if (updates) {
        for (let post of updates.newData) {
            try {
                sendVKPostMessage(channel, post);
            } catch (err) {
                console.error(err);
            }
        }
        storage.set(link, hashUpdates(posts));
    } else {
        console.info(`${link}[posts] => none`);
    }
}

function sendVKPostMessage(channel, post) {
    let { text = '', attachment = null } = post;
    if (!attachment || attachment.type === 'photo') {
        if (text.length) channel.sendMessage(createVKPostMessage(text, attachment))
        else if (text.length === 0 && attachment) {
            let { photo, caption } = createVKPhotoMessage(attachment);
            channel.sendPhoto(photo, { caption });
        }
    }
}

function createVKPostMessage(text, attachment) {
    let photo = attachment ? `<a href="${attachment.photo.src_big}">\u{2063}</a>` : '';
    let textMessage = `<strong>НОВЫЙ ПОСТ</strong>
    ${htmlToText.fromString(text)}
    ${photo}`;
    let message = newMessage(textMessage);
    message.parseMode = "HTML";
    return message.compile();
}

function createVKPhotoMessage(attachment) {
    let photo = attachment.photo.src_big;
    let caption = attachment.photo.text;
    return { photo, caption };
}

module.exports = jobFactory(vkSpider, 60000);