var db = require('../libs/db');
var collection = db.collection('events');

var convertToSlug = function(str) {
    return str.toLowerCase().replace(/ /g,'-').replace(/[^\w-]+/g,'');
};

var save = function(event, callback) {
    event.slug = convertToSlug(event.name);
    collection.save(event, { w:1 }, callback);
};

var remove = function(event_id, callback) {
    collection.remove({ _id: event_id }, {w:1}, callback);
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
    list: list
};
