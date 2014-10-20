var path = require('path');
var tingoDB = require('tingodb')().Db;

var dbPath = path.join(__dirname, '..', 'config', 'db', process.env.NODE_ENV === 'test' ? 'test' : '');
require('fs-extra').ensureDirSync(dbPath);

var db = new tingoDB(dbPath, {});

module.exports = db;