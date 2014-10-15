var assert = require('assert');
var db = require('../libs/db');

describe('Database', function () {
    // before(function() {});
    // after(function() {});
    // beforeEach(function() {});
    // afterEach(function() {});
    describe('objectCheck', function () {
        it('should not be undefined', function () {
            assert.notEqual(undefined, db);
        });
    });
    describe('History', function () {
        it('should have some entries ...', function () {
            db.history
                .find()
                .sort('_id', -1)
                .limit(5)
                .each(function(err, item) {
                    if(item.tstamp)
                        console.error('tstamp', new Date((item.tstamp*1000)).toISOString());
                    else
                        console.error('h', item);
                });
            assert.equal(true, false);
        });
    });
});