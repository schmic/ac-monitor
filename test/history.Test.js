var assert = require('assert');
var db = require('../libs/db');

describe('History', function () {
    // before(function() {});
    // after(function() {});
    // beforeEach(function() {});
    // afterEach(function() {});
    describe('objectCheck', function () {
        it('should not be undefined', function () {
            assert.notEqual(undefined, db.history);
        });
    });
    describe('can', function () {
        it('drop the collection', function(done) {
            db.history.collection(function(err, collection) {
                collection.drop(function(err, result) {
                    assert.equal(null, err);
                    assert.equal(true, result);
                    done();
                })
            })
        });
        it('add two entries', function(done) {
            var h = require('../models/history')('mocha', 'should be able to add an entry');
            var i = require('../models/history')('mocha', 'should be able to add an entry');
            db.history.add([h, i], function(err, result) {
                assert.equal(null, err);
                assert.equal(2, result.length);
                done();
            });
        });
        it('get two entries sorted by _id', function(done) {
            db.history.get(null, { limit: 2, sort: { '_id': -1 } }, function(err, results) {
                assert.equal(null, err);
                assert.equal(2, results.length);
                done();
            });
        });
    });
});