var assert = require('assert');

describe('Event', function(){
    // before(function() {});
    // after(function() {});
    // beforeEach(function() {});
    // afterEach(function() {});
    describe('objectCheck', function() {
        it('should not be undefined', function() {
            assert.notEqual(undefined, require('../models/event'));
        });
    });
    describe('Event', function() {
        it('gets created', function (done) {
            var Event = require('../models/event');
            var event = {
                name: 'testEvent01',
                preset: 'testPreset01',
                date: '1970-01-01 01:00:00',
                autostart: false
            };
            Event.save(event, function (err, event) {
                if (err) console.error(err);
                assert.notEqual(null, event);
                done();
            });
        });
        it('gets found and booked', function(done) {
            var Event = require('../models/event');
            var booking = {
                user_id: 4711,
                car: 'bmw_m3_foo'
            };
            Event.collection.findOne({name: 'testEvent01'}, function(err, event) {
                if(err) console.error(err);
                assert.notEqual(null, event);
                Event.addBooking(event._id, booking, function(err, event) {
                    if(err) console.error(err);
                    assert.notEqual(null, event);
                    done();
                });
            });
        });
        it('gets found by userId', function(done) {
            done();
        });
        it('gets found and unbooked', function(done) {
            var Event = require('../models/event');
            var booking = {
                user_id: 4711,
                car: 'bmw_m3_foo'
            };
            Event.collection.findOne({name: 'testEvent01'}, function(err, event) {
                if(err) console.error(err);
                assert.notEqual(null, event);
                Event.removeBooking(event._id, booking.user_id, function(err, event) {
                    if(err) console.error(err);
                    assert.notEqual(null, event);
                    done();
                });
            });
        });
        it('gets found and deleted', function (done) {
            var Event = require('../models/event');
            Event.collection.findOne({name: 'testEvent01'}, function(err, event) {
                if (err) console.error(err);
                assert.notEqual(null, event);
                Event.remove(event._id, function (err, result) {
                    if (err) console.error(err);
                    assert.equal(null, err);
                    assert.notEqual(null, result);
                    done();
                });
            });
        });
    });
});