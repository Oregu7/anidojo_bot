const AnimangaModel = require('../../app/models/animangaUpdates-model');

module.exports = (animanga, updates) => {
    AnimangaModel.update({ site: animanga.site }, { $set: { chapters: updates } });
}