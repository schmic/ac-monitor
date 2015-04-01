var moment = require('moment');
var collection = require('../libs/db-util').collection('events.json');

var removeEmptyStrings = function(event) {
    Object.keys(event).forEach(function(key) {
        if(event[key] === '')
            event[key] = undefined;
    });
    return event;
};

var convertToSlug = function(str) {
    return str.toLowerCase().replace(/ /g,'-').replace(/[^\w-]+/g,'');
};

var save = function(event, cb) {
    event = removeEmptyStrings(event);

    if(event._id) {
        collection.update({ _id: event._id }, event, {upsert: true}, cb);
    }
    else {
        event.slug = convertToSlug(event.name);
        event.tstamp = moment(event.date).unix();
        collection.insert(event, cb);
    }
};

var remove = function(event_id, cb) {
    collection.remove({ _id: event_id }, cb);
};

var getAll = function(cb) {
    collection
        .find({})
        .sort({ tstamp: 1 })
        .toArray(cb);
};

var getDue = function(fromTstamp, toTstamp, cb) {
    collection
        .find({ $and: [{ tstamp: { $gt: fromTstamp}}, { tstamp: { $lte: toTstamp}} ]})
        .sort({ tstamp: 1 })
        .toArray(cb);
};

var getOne = function(id, cb) {
    collection.findOne({ '_id': id}, cb);
};

module.exports = {
    collection: collection,
    save: save,
    remove: remove,
    getAll: getAll,
    getDue: getDue,
    getOne: getOne
};
