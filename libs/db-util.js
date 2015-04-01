var path = require('path');
var fsExtra = require('fs-extra');

var getDabasePath = function() {
    return path.join(__dirname, '..', 'config', 'db');
};

fsExtra.ensureDirSync(getDabasePath());
console.info('Database Path:', getDabasePath());

var Db = require('tingodb')().Db;
var db = new Db(getDabasePath(), {});

module.exports = db;
