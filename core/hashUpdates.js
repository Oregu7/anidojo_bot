hash = require('object-hash');
//преобразуем список обновлением в список хэшей url-ов(т.к они не изменны).
module.exports = (data) => data.map(item => hash.MD5(item.url));