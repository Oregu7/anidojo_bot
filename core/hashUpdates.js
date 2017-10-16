hash = require('object-hash');
module.exports = (data) => data.map(item => hash.MD5(item));