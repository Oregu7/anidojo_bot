const hash = require('object-hash');

module.exports = (oldUpdates, newUpdates) => {
    let oldUpdatesSet = new Set(oldUpdates);
    let currentUpdates = newUpdates.filter(item => !oldUpdatesSet.has(hash.MD5(item.url)));
    if (currentUpdates.length) {
        return {
            newData: currentUpdates
        }
    }
    return false;
}