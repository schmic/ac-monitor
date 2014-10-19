var db = require('../libs/db');

var add = function (user, entry, callback) {
    var tstamp = Math.round(+new Date()/1000);
    db.collection('history').insert({ user: user, entry: entry, tstamp: tstamp }, {w: 1}, callback);
};

var last = function (options, callback) {
    options = options || {};
    options.limit = options.limit || 10;
    options.sort = options.sort || { '_id': -1 };
    db.collection('history').find(null, options).toArray(callback);
};

module.exports = {
    add: add,
    last: last
};
