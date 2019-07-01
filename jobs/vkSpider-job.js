const config = require('config');
const rp = require('request-promise');
const storage = require('dirty')('updates.db');
const htmlToText = require('html-to-text');
const { createInlineKeyboard, newMessage } = require("telbot").Utils;
const getUpdates = require('../core/getUpdates');
const hashUpdates = require('../core/hashUpdates');
const choice = require('../core/choice');
const jobFactory = require('../core/jobFactory');

//initialize
const groups = config.get("Customer.jobs.vkSpider.groups");

async function vkSpider(channel) {
    for (let group of groups) {
        let posts = await getPosts(group);
        if (posts) prepareVKPosts(channel, group, posts);
    }
}

async function getPosts(group, count = 5) {
    const baseURL = `https://api.vk.com/method/wall.get`;
    let qs = Object.assign(group, {
        v: "5.100",
        count,
        filter: "owner",
        access_token: process.env.SERVICE_KEY
    });
    try {
        let { response } = JSON.parse(await rp.get({ uri: baseURL, qs }));
        if (!response) return false;

        return response.map(item => {
            let name = group.domain ? group.domain : `club${group.owner_id}`;
            let url = `https://vk.com/${name}/post-${item.id}`;
            return Object.assign({}, item, { url });
        });
    } catch (err) {
        console.error(err);
        return false;
    }
}

function prepareVKPosts(channel, group, posts) {
    let name = group.domain ? group.domain : `club${group.owner_id}`;
    const link = `https://vk.com/${name}/`;
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
        //if (text.length) channel.sendMessage(createVKPostMessage(text, attachment))
        if (text.length === 0 && attachment) {
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

module.exports = jobFactory(vkSpider, config.get("Customer.jobs.vkSpider.time"));