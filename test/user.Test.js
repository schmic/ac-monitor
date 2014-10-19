/*
var assert = require('assert');
var db = require('../libs/db');

describe('Users', function () {
    // before(function() {
    // });
    // after(function() {});
    beforeEach(function() {
    });
    // afterEach(function() {
    // });
    describe('objectCheck', function () {
        it('should not be undefined', function () {
            assert.notEqual(undefined, db.users);
        });
    });
    describe('CRUD check', function () {
        it('should be possible to create a user #1', function () {
            var u = require('../models/user')('test01', 0815);
            db.setUser(u, function (err, res) {
                console.log(err, res);
                assert.equal({}, err);
                done();
            })
        });
    });
    describe('CRUD check', function () {
        it('should be possible to create a user #2', function() {
            var u = require('../models/user')('test02', 0816);
            db.setUser(u, function(err, res) {
                assert.equal(null, err);
                done();
            })
        });
    });
    describe('CRUD check', function () {
        it('should be possible to create a user #3', function() {
            var u = require('../models/user')('test03', 0817);
            db.setUser(u, function(err, res) {
                assert.equal(null, err);
                done();
            })
        });
    });
    describe('CRUD check', function () {
        it('and now we should find three users in the db', function() {
            db.users.find().count(function(err, count) {
                console.log(err, count);
                assert.equal(null, err);
                assert.equal(3, count);
                done();
            });
        });
    });
});*/
