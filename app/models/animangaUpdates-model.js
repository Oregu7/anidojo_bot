const mongoose = require("mongoose");

const animangaUpdatesSchema = mongoose.Schema({
    site: { type: String, lowercase: true, required: true, unique: true },
    type: { type: String, enum: ["manga", "anime", "ranobe"], lowercase: true, required: true, index: true },
    chapters: [{
        url: String,
        title: String
    }],
    _created: { type: Date, default: Date.now },
    _modified: { type: Date, default: Date.now },
});

animangaUpdatesSchema.pre("save", function(next) {
    if (this.isNew) this._created = new Date;
    next();
});

module.exports = mongoose.model("animanga_updates", animangaUpdatesSchema);