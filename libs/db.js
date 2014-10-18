var path = require('path');
var assert = require('assert');
var tingoDB = require('tingodb')().Db;

function addHistory(h) {
    h.tstamp = Math.round(+new Date()/1000);
    db.collection('history').insert(h, {w: 1}, function(err, result) {
        if (err) { return console.error(err); }
        console.log('result:', result);
    });
}

var dbPath = path.join(__dirname, '..', 'config', 'db', process.env.NODE_ENV || 'dev');
require('fs-extra').ensureDir(dbPath, function(err) {
    assert.equal(null, err);
});
var db = new tingoDB(dbPath, {});

module.exports = {
    db: db,
    users: db.collection('users'),
    servers: db.collection('servers'),
    history: db.collection('history'),
    addHistory: addHistory
};
