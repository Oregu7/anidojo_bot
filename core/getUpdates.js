const hash = require('object-hash');

//проверяем обновились ли данные
module.exports = (oldUpdates, newUpdates) => {
    //создаем set из старых данных
    let oldUpdatesSet = new Set(oldUpdates);
    /*
        Фильруем новые данные. 
        Условие: элемент не встречается в старом множестве
        Проверяем хэши url-ов
    */
    let currentUpdates = newUpdates.filter(item => !oldUpdatesSet.has(hash.MD5(item.url)));
    //если обновления присутствуют, возвращаем иначе false.
    if (currentUpdates.length) {
        return {
            newData: currentUpdates
        }
    }
    return false;
}