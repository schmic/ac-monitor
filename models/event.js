var db = require('../libs/db');
var collection = db.collection('events');

var save = function(event, callback) {
    collection.save(event, { w:1 }, callback);
};

var remove = function(id, callback) {
    collection.remove({ _id: id }, {w:1}, callback);
};

var findBy = function(key, value, callback) {
    var search = {};
    search[key] = value;
    collection.findOne(search, callback);
};

var list = function(options, callback) {
    options = options || {};
    //options.limit = options.limit || 10;
    options.sort = options.sort || { '_id': -1 };
    collection.find(null, options).toArray(callback);
};

module.exports = {
    collection: collection,
    save: save,
    remove: remove,
    findBy: findBy,
    list: list
};
