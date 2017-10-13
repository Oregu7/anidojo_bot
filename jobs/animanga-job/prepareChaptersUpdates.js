module.exports = (site, updates) => {
    if (updates) {
        console.log(site, updates.newData);
    } else {
        console.info(`${site} => none`);
    }
}