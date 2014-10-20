var db = require('../libs/db');
var collection = db.collection('bookings');

var save = function(booking, callback) {
    collection.save(booking, { w:1 }, callback);
};

var remove = function(id, callback) {
    collection.remove({ _id: id }, {w:1}, callback);
};

var findByEventId = function(eventId, callback) {
    collection.find({event_id: eventId}, callback);
};

var findByUserId = function(userId, callback) {
    collection.find({user_id: userId}, callback);
};

module.exports = {
    collection: collection,
    save: save,
    remove: remove,
    findByEventId: findByEventId,
    findByUserId: findByUserId,
    list: list
};
