const fs = require("fs");
const { join } = require("path");

module.exports.start = (...args) => {
    //получаем все папки и файлы в каталоге jobs
    fs.readdir(__dirname, (err, files) => {
        //фильтруем и получаем список работ (должны оканчиваться на -job или -job.js)
        let jobsList = files.filter(file => /\-job(\.js)?$/.test(file));
        for (job of jobsList) {
            //формируем путь до скрипта
            let jobDir = join(__dirname, job);
            //загружаем и инициализируем новую работу
            require(jobDir)(...args);
        }
    })
}