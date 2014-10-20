var db = require('../libs/db');
var collection = db.collection('history');
var User = require('../models/user');

var add = function (userId, entry, callback) {
    var tstamp = Math.round(+new Date()/1000);
    User.findBySteamId(userId, function(err, user) {
        collection.insert({ user: user ? user.personaname : userId, entry: entry, tstamp: tstamp }, {w: 1}, callback);
    });

};

var last = function (options, callback) {
    options = options || {};
    options.limit = options.limit || 10;
    options.sort = options.sort || { '_id': -1 };
    collection.find(null, options).toArray(callback);
};

module.exports = {
    add: add,
    last: last
};
