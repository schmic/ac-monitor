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
                autostart: false,
                bookings: []
            };
            Event.save(event, function (err, event) {
                if (err) console.error(err);
                assert.notEqual(null, event);
                console.log('created event', event, '\n');
                done();
            });
        });
        it('gets found and booked', function(done) {
            var Event = require('../models/event');
            Event.findBy('name', 'testEvent01', function(err, event) {
                if (err) console.error(err);
                assert.notEqual(null, event);
                Event.addBooking(event._id, '4711', function(err, result) {
                    if (err) console.error(err);
                    assert.notEqual(null, event);
                    assert.equal(1, result);
                    done();
                });
            });
        });
        it('gets found by userId', function(done) {
            var Event = require('../models/event');
            Event.findByUserId('4711', function(err, event) {
                if (err) console.error(err);
                assert.notEqual(null, event);
                console.log(event);
            });
        });
        it('gets found and unbooked', function(done) {
            var Event = require('../models/event');
            Event.findBy('name', 'testEvent01', function(err, event) {
                if (err) console.error(err);
                assert.notEqual(null, event);
                Event.removeBooking(event._id, '4711', function(err, result) {
                    if (err) console.error(err);
                    assert.notEqual(null, event);
                    assert.equal(1, result);
                    done();
                });
            });
        });
        it('gets found and deleted', function (done) {
            var Event = require('../models/event');
            Event.findBy('name', 'testEvent01', function(err, event) {
                if (err) console.error(err);
                assert.notEqual(null, event);
                Event.remove(event._id, function (err, result) {
                    if (err) console.error(err);
                    assert.equal(null, err);
                    assert.notEqual(null, result);
                    console.log('deleted event', result ? 'true' : 'false');
                    done();
                });
            });
        });
    });
});