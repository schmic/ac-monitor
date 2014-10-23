var db = require('../libs/db');
var collection = db.collection('events');

var convertToSlug = function(str) {
    return str.toLowerCase().replace(/ /g,'-').replace(/[^\w-]+/g,'');
};

var save = function(event, callback) {
    event.slug = convertToSlug(event.name);
    event.bookings = event.bookings ? event.bookings : {};
    collection.save(event, { w:1 }, callback);
};

var saveBooking = function(event_id, booking, callback) {
    collection.findOne({_id: event_id}, function(err, event) {
        if(err) callback(err, null);
        if(booking.GUID in event.bookings) {
            callback('already booked', null);
        }
        else {
            event.bookings[booking.GUID] = booking;
            save(event, callback);
        }
    });
};

var removeBooking = function(event_id, user_id, callback) {
    collection.findOne({_id: event_id}, function(err, event) {
        if(user_id in event.bookings) {
            delete event.bookings[user_id];
            save(event, callback);
        }
        else {
            callback('not booked', null);
        }
    });
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
    list: list,
    saveBooking: saveBooking,
    removeBooking: removeBooking
};
