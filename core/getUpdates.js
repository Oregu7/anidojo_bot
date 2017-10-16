const hash = require('object-hash');

module.exports = (oldUpdates, newUpdates) => {
    let oldUpdatesSet = new Set(oldUpdates);
    let currentUpdates = newUpdates.filter(item => {
        console.log(item.title, hash.MD5(item));
        return !oldUpdatesSet.has(hash.MD5(item));
    });
    if (currentUpdates.length) {
        return {
            newData: currentUpdates
        }
    }
    return false;
}