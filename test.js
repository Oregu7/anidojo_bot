const hash = require("object-hash");
let data = {
    title: `Манга Тени равноденствия (Haikyuu!! dj – Higan no Kagee. It\'s whole like the flash.: Haikyuu!! dj – Higan no Kagee) (Кизу Нацуки: романтика, повседневность, сёнэн-ай, драма)`,
    url: 'http://readmanga.me/haikyuu___dj___higan_no_kagee__it_s_whole_like_the_flash_'
}

console.log(hash(data));