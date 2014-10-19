var db = require('../libs/db');

var save = function(user, callback) {
    var collection = db.collection('users');
    collection.findOne({steamid: user.steamid}, function(err, item) {
        if(err) return console.error(err);
        if(item) {
            console.log('User.save:updating', user.steamid);
            collection.update({id: user.id}, user, {w:1}, callback);
        }
        else {
            console.log('User.save:inserting', user.steamid);
            collection.insert(user, {w:1}, callback);
        }
    });
};

var findBySteamId = function(id, callback) {
    var search = { steamid: id };
    var collection = db.collection('users');
    return callback ? collection.findOne(search, callback) : collection.findOne(search);
};


module.exports = {
    save: save,
    findBySteamId: findBySteamId
};