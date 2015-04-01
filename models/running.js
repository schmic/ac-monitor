var collection = require('../libs/db-util').collection('running.json');

var add = function(server, cb) {
    var doc = {
        presetName: server.preset.presetName,
        tstamp: Math.round(+new Date()/1000)
    };
    collection.update({ presetName: doc.presetName}, doc, { upsert: true }, cb);
};

var remove = function(server, cb) {
    collection.remove({ presetName: server.preset.presetName}, cb);
};

var get = function (callback) {
    var cursor = collection.find({});
    return callback ? cursor.toArray(callback) : cursor;
};

module.exports = {
    add: add,
    remove: remove,
    get: get,
    collection: collection
};
