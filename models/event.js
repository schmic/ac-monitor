var db = require('../libs/db');
var collection = db.collection('events');

var convertToSlug = function(str) {
    return str.toLowerCase().replace(/ /g,'-').replace(/[^\w-]+/g,'');
};

var save = function(event, callback) {
    event.slug = convertToSlug(event.name);
    collection.save(event, { w:1 }, callback);
};

var addBooking = function(event_id, user_id, callback) {
    findBy('_id', event_id, function(err, event) {
        if(err) callback(err, null);
        if(event.bookings.indexOf(user_id) >= 0) {
            callback('already booked', null);
        }
        else {
            event.bookings.push(user_id);
            save(event, callback);
        }
    });
};

var removeBooking = function(event_id, user_id, callback) {
    findBy('_id', event_id, function(err, event) {
        if(event.bookings.indexOf(user_id) >= 0) {
            event.bookings.splice(event.bookings.indexOf(user_id), 1);
            save(event, callback);
        }
        else {
            callback('not booked', null);
        }
    });
};

var remove = function(id, callback) {
    collection.remove({ _id: id }, {w:1}, callback);
};

var findBy = function(key, value, callback) {
    var search = {};
    search[key] = value;
    collection.find(search, callback);
};

var findByUserId = function(userId, callback) {
    collection.find({}, function(err, events) {
        callback(err, events);
    });
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
    findByUserId: findByUserId,
    list: list,
    addBooking: addBooking,
    removeBooking: removeBooking
};
