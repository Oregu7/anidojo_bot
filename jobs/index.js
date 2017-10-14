const fs = require("fs");
const { join } = require("path");

module.exports.start = (...args) => {
    fs.readdir(__dirname, (err, files) => {
        let jobsList = files.filter(file => /\-job(\.js)?$/.test(file));
        for (job of jobsList) {
            let jobDir = join(__dirname, job);
            require(jobDir)(...args);
        }
    })
}