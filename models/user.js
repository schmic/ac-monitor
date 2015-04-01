var collection = require('../libs/db-util').open('users');

var save = function(user, callback) {
    collection.update({ steamid: user.steamid }, user, { upsert: 1, w:1 }, callback);
};

var remove = function(steamid, callback) {
    collection.remove({ steamid: steamid}, {w:1}, callback);
};

var findBySteamId = function(id, callback) {
    findBy('steamid', id, callback);
};

var findById = function(id, callback) {
    findBy('_id', id, callback);
};

var findBy = function(key, value, callback) {
    var search = {};
    search[key] = value;
    collection.findOne(search, callback);
};

module.exports = {
    collection: collection,
    save: save,
    remove: remove,
    findBy: findBy,
    findById: findById,
    findBySteamId: findBySteamId
};