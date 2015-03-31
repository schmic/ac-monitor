var collection = require('../libs/db-helper').open('history');

var add = function (userId, entry, callback) {
    //var User = require('../models/user');
    //User.findBySteamId(userId, function(err, user) {
    //    collection.insert({ user: user ? user.personaname : userId, entry: entry, tstamp: tstamp }, {w: 1}, callback);
    //});

    var tstamp = Math.round(+new Date()/1000);
    collection.insert({
        user: userId,
        entry: entry,
        tstamp: tstamp
    }, callback);
};

var last = function (limit, callback) {
    collection.find({})
        .sort({ tstamp: -1 })
        .limit(limit)
        .exec(callback);
};

module.exports = {
    collection: collection,
    add: add,
    last: last
};
