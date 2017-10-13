const Immutable = require("immutable");

function createImmutableSet(data) {
    return Immutable.Set.of(...data.map(item => Immutable.Map(item)));
}

function checkIsSet(...data) {
    data.forEach(item => {
        if (!Immutable.Set.isSet(item)) {
            throw new Error("Incorrect data");
        }
    })
}

function checkChange(previous, next) {
    return !Immutable.is(previous, next);
}

function getNewData(previous, next) {
    return next.subtract(previous);
}

function getUnionData(previous, next) {
    return previous.union(next);
}

function normilizeData(data) {
    return data.toArray().map(item => item.toJS());
}

module.exports = function(previous, next) {
    const previousManga = createImmutableSet(previous);
    const nextManga = createImmutableSet(next);

    if (checkChange(previousManga, nextManga)) {
        let newData = normilizeData(getNewData(previousManga, nextManga));
        let unionData = normilizeData(getUnionData(previousManga, nextManga));
        return { newData, unionData };
    } else {
        return false;
    }
}