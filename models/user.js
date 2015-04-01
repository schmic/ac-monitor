var collection = require('../libs/db-util').collection('users.json');

var save = function(user, cb) {
    collection.update({ steamid: user.steamid }, user, { upsert: 1, w:1 }, cb);
};

var remove = function(steamid, cb) {
    collection.remove({ steamid: steamid}, {w:1}, cb);
};

var findBySteamId = function(id, cb) {
    findBy('steamid', id, cb);
};

var findById = function(id, cb) {
    findBy('_id', id, cb);
};

var findBy = function(key, value, cb) {
    var search = {};
    search[key] = value;
    collection.findOne(search, cb);
};

module.exports = {
    collection: collection,
    save: save,
    remove: remove,
    findBy: findBy,
    findById: findById,
    findBySteamId: findBySteamId
};