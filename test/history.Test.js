var assert = require('assert');
var db = require('../libs/db');

describe('History', function () {
    before(function() { this.History = require('../models/history')});
    // after(function() {});
    // beforeEach(function() {});
    // afterEach(function() {});
    describe('objectCheck', function () {
        it('should not be undefined', function () {
            assert.notEqual(undefined, this.History);
        });
    });
    describe('can', function () {
        it('add two entries', function(done) {
            this.History.add('mocha', 'should be able to add an entry', function(err, result) {
                if(err) console.error(err);
                assert.equal(1, result.length);
            });
            this.History.add('mocha', 'should be able to add an entry', function(err, result) {
                if(err) console.error(err);
                assert.equal(1, result.length);
                done();
            });
        });
        it('get two entries sorted by _id', function(done) {
            this.History.last({ limit: 2, sort: { '_id': -1 } }, function(err, results) {
                if(err) console.error(err);
                assert.equal(2, results.length);
                done();
            });
        });
        it('drop the collection', function(done) {
            this.History.collection.drop(function(err, result) {
                if(err) console.error(err);
                assert.equal(true, result);
                done();
            });
        });
    });
});