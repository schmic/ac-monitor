var assert = require('assert');
var env = require('../libs/env');

describe('Preset', function(){
    before(function() {
        this.p_test01 = require('../libs/preset')('test01');
        this.p_test01_guid = '908154711';
    });
    after(function() {
        delete this.p_test01;
    });
    // beforeEach(function() {});
    // afterEach(function() {});
    describe('objectCheck', function() {
        it('should not be undefined', function() {
            assert.notEqual(undefined, this.p_test01);
        });
    });
    describe('namesAndPortsCheck', function() {
        it('presetName should be test01', function() {
            assert.equal('test01', this.p_test01.presetName);
        });
        it('serverName should be "Mocha-UnitTesting"', function(){
            assert.equal('Mocha-UnitTesting', this.p_test01.serverName);
        });
        it('udp-/http-ports should be 9701/19701', function() {
            assert.equal(9701, this.p_test01.get('PORT'));
            assert.equal(19701, this.p_test01.get('HTTP_PORT'));
        });

    });
    describe('eventEnvironmentCheck', function() {
        it('cars isArray()', function() {
            assert.equal(true, Array.isArray(this.p_test01.cars));
        });
        it('tracks isArray()', function() {
            assert.equal(true, Array.isArray(this.p_test01.tracks));
        });
        it('hasPassword should be true', function() {
            assert.equal(true, this.p_test01.hasPassword);
        });
        it('hasPenalties should be false', function() {
            assert.equal(false, this.p_test01.hasPenalties);
        });
        it('hasPickupMode should be false', function() {
            assert.equal(false, this.p_test01.hasPickupMode);
        });
        it('hasRegisterToLobby should be false', function() {
            assert.equal(false, this.p_test01.hasRegisterToLobby);
        });
        it('timeOfDay should be 13:00', function() {
            assert.equal('11:30:00', this.p_test01.timeOfDay);
        });
        it('maxClients should be 20', function() {
            assert.equal(20, this.p_test01.get('MAX_CLIENTS'));
        });
    });
    describe('sessionsCheck', function() {
        it('hasBookingSession should be true', function() {
            assert.equal(true, this.p_test01.hasBookingSession);
        });
        it('getBookingSession should not be empty', function() {
            assert.notEqual(undefined, this.p_test01.bookingSession);
        });
        it('hasPracticeSession should be true', function() {
            assert.equal(true, this.p_test01.hasPracticeSession);
        });
        it('getPracticeSession should not be empty', function() {
            assert.notEqual(undefined, this.p_test01.practiceSession);
        });
        it('hasQualifySession should be true', function() {
            assert.equal(true, this.p_test01.hasQualifySession);
        });
        it('getQualifySession should not be empty', function() {
            assert.notEqual(undefined, this.p_test01.qualifySession);
            assert.equal(true, this.p_test01.qualifySession.WAIT_TIME >= 60);
        });
        it('hasRaceSession should be true', function() {
            assert.equal(true, this.p_test01.hasRaceSession);
        });
        it('getRaceSession should not be empty', function() {
            assert.notEqual(undefined, this.p_test01.raceSession);
            assert.equal(true, this.p_test01.raceSession.WAIT_TIME >= 60);
        });
    });
    describe('entryListCheck', function() {
        it('#numOfDrivers should be 2', function() {
            assert.equal(2, Object.keys(this.p_test01.entries).length);
        });
        it('should have bookings for GUIDs', function() {
            var presets = env.getPresetNames();
            for(var i = 0; i < presets.length; i++) {
                var p = require('../libs/preset')(presets[i]);
                if(p.isBooked(this.p_test01_guid)) {
                    console.log('booked in', p.presetName, '\n');
                }
            }
        });
        it('get booking for GUID', function() {
            var booking = require('../libs/preset')('test-booking').getBooking(this.p_test01_guid);
            assert.notEqual(null, booking);
        });
        it('update booking for GUID', function() {
            var p = require('../libs/preset')('test-booking');
            var booking = p.getBooking(this.p_test01_guid);
            booking.TEAM = 'someWeirdStringForATeam';
            assert.equal(true, p.setBooking(booking));
        });
        it('insert new booking', function() {
            var booking = {};
            booking.DRIVERNAME = 'Test-Dummy-Insert';
            booking.TEAM = 'added from test';
            booking.GUID = '0987654321';
            booking.MODEL = 'bmw_m3_e30_dtm';
            booking.SKIN = 'bmw';
            booking.SPECTATOR_MODE = '0';
            assert.equal(true, require('../libs/preset')('test-booking').setBooking(booking));
        });
        it('delete previous booking', function() {
            var guid = '0987654321';
            assert.equal(true, require('../libs/preset')('test-booking').deleteBooking(guid));
            assert.equal(null, require('../libs/preset')('test-booking').getBooking(guid));
        });
    });
    describe('entryListModification', function() {
    });
    describe('acMonitorExtension', function() {
    });
});