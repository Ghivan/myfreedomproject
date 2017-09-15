function getNextId(entities) {
    const maxId = entities.length ? Math.max.apply(null, entities.map(entity => entity.id)) : 0;
    return maxId + 1;
}

module.exports = {
    getNextId
};