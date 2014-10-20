var assert = require('assert');

describe('User', function(){
    before(function() {
        this.User = require('../models/user');
    });
    // after(function() {});
    // beforeEach(function() {});
    // afterEach(function() {});
    describe('objectCheck', function() {
        it('should not be undefined', function() {
            assert.notEqual(undefined, this.User);
        });
    });
    describe('CRUD', function() {
        it('create', function(done) {
            this.User.save({
                steamid: '0815',
                personaname: 'test15',
                isAdmin: false
            }, done);
        });
        it('read', function(done) {
            this.User.findBySteamId('0815', function(err, user) {
                assert.equal(false, user.isAdmin);
            });
            done();
        });
        it('update', function(done) {
            this.User.save({
                steamid: '0815',
                isAdmin: true
            }, done);
        });
        it('read', function(done) {
            this.User.findBySteamId('0815', function(err, user) {
                assert.equal(true, user.isAdmin);
            });
            done();
        });
        it('delete', function() {
            this.User.remove('0815', function(err, result) {
                assert.equal(1, result);
            });
        });
    });
});