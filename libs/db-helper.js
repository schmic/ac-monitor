var Datastore = require('nedb');

var collections = {};

var getCollectionFilename = function(collection) {
    return require('path').join(__dirname, '..', 'config', 'db', collection + '.json');
};

module.exports = {
    open: function(collection) {
        if(collections.hasOwnProperty(collection) === false) {
            collections[collection] = new Datastore({
                filename: getCollectionFilename(collection),
                autoload: true
            });
        }
        return collections[collection];
    }
};
