var moment = require('moment');
var collection = require('../libs/db-helper').open('events');

var convertToSlug = function(str) {
    return str.toLowerCase().replace(/ /g,'-').replace(/[^\w-]+/g,'');
};

var save = function(event, callback) {
    if(event._id) {
        collection.update({ _id: event._id }, event, {upsert: true}, callback);
    }
    else {
        event.slug = convertToSlug(event.name);
        event.tstamp = moment(event.date).unix();
        collection.insert(event, callback);
    }
};

var remove = function(event_id, callback) {
    collection.remove({ _id: event_id }, callback);
};

var list = function(callback) {
    collection.find({})
        .sort({ tstamp: 1 })
        .exec(callback);
};

var get = function(id, callback) {
    collection.findOne({ '_id': id}, callback);
};

module.exports = {
    collection: collection,
    save: save,
    remove: remove,
    list: list,
    get: get
};
