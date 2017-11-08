const AnimangaModel = require('../../app/models/animangaUpdates-model');

module.exports = async(animanga, updates) => {
    let ok = await AnimangaModel.findOne({ site: animanga.site });
    if (ok) {
        return AnimangaModel.update({ site: animanga.site }, { $set: { chapters: updates, _modified: Date.now() } });
    } else {
        return AnimangaModel.create({
            site: animanga.site,
            type: animanga.type,
            chapters: updates
        });
    }
}