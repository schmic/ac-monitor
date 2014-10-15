var Db = require('tingodb')().Db;
var db = new Db(__dirname + ' /../config/db', {});

function addHistory(h) {
    h.tstamp = Math.round(+new Date()/1000);
    db.collection('history').insert(h, {w: 1}, function(err, result) {
        if (err) { return console.error(err); }
        console.log('result:', result);
    });
}

module.exports = {
    database: db,
    users: db.collection('users'),
    servers: db.collection('servers'),
    history: db.collection('history'),
    addHistory: addHistory
};
