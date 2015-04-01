var User = require('../models/user');
var collection = require('../libs/db-util').collection('history.json');

var add = function (userId, entry, cb) {
    var tstamp = Math.round(+new Date()/1000);
    User.findBySteamId(userId, function(err, user) {
        if(err) {
            console.error(err);
        }
        collection.insert({
            user: user ? user.personaname : userId,
            entry: entry,
            tstamp: tstamp
        }, cb);
    });

};

var last = function (limit, cb) {
    collection.find({})
        .sort({ tstamp: -1 })
        .limit(limit)
        .toArray(cb);
};

module.exports = {
    collection: collection,
    add: add,
    last: last
};
