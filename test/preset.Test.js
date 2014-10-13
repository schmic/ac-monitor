var assert = require('assert');

describe('Preset', function(){
    before(function() {
        this.preset = require('../libs/preset')('dev01');
    });
    after(function() {
        delete this.preset;
    });
    // beforeEach(function() {});
    // afterEach(function() {});
    describe('objectCheck', function() {
        it('should not be undefined', function() {
            assert.notEqual(undefined, this.preset);
        });
    });
    describe('namesAndPortsCheck', function() {
        it('presetName should be dev01', function() {
            assert.equal('dev01', this.preset.presetName);
        });
        it('serverName should be "[DEV-01] - schmic - VRev"', function(){
            assert.equal('[DEV-01] - schmic - VRev', this.preset.serverName);
        });
        it('udp-/http-ports should be 9701/19701', function() {
            assert.equal(9701, this.preset.ini.SERVER.PORT);
            assert.equal(19701, this.preset.ini.SERVER.HTTP_PORT);
        });

    });
    describe('eventEnvironmentCheck', function() {
        it('cars isArray()', function() {
            assert.equal(true, Array.isArray(this.preset.cars));
        });
        it('tracks isArray()', function() {
            assert.equal(true, Array.isArray(this.preset.tracks));
        });
        it('hasPassword should be true', function() {
            assert.equal(true, this.preset.hasPassword);
        });
        it('hasPenalties should be false', function() {
            assert.equal(false, this.preset.hasPenalties);
        });
        it('hasPickupMode should be false', function() {
            assert.equal(false, this.preset.hasPickupMode);
        });
        it('hasRegisterToLobby should be false', function() {
            assert.equal(false, this.preset.hasRegisterToLobby);
        });
        it('timeOfDay should be 13:00', function() {
            assert.equal('11:00:00', this.preset.timeOfDay);
        });
        it('maxClients should be 20', function() {
            assert.equal(20, this.preset.get('MAX_CLIENTS'));
        });
    });
    describe('sessionsCheck', function() {
        it('hasBookingSession should be true', function() {
            assert.equal(true, this.preset.hasBookingSession);
        });
        it('getBookingSession should not be empty', function() {
            assert.notEqual(undefined, this.preset.bookingSession);
        });
        it('hasPracticeSession should be true', function() {
            assert.equal(true, this.preset.hasPracticeSession);
        });
        it('getPracticeSession should not be empty', function() {
            assert.notEqual(undefined, this.preset.practiceSession);
        });
        it('hasQualifySession should be true', function() {
            assert.equal(true, this.preset.hasQualifySession);
        });
        it('getQualifySession should not be empty', function() {
            assert.notEqual(undefined, this.preset.qualifySession);
            assert.equal(true, this.preset.qualifySession.WAIT_TIME >= 60);
        });
        it('hasRaceSession should be true', function() {
            assert.equal(true, this.preset.hasRaceSession);
        });
        it('getRaceSession should not be empty', function() {
            assert.notEqual(undefined, this.preset.raceSession);
            assert.equal(true, this.preset.raceSession.WAIT_TIME >= 60);
        });
    });
    describe('entryListCheck', function() {
        it('#numOfDrivers should be 5', function() {
            assert.equal(5, Object.keys(this.preset.drivers).length);
        });
    });
    describe('entryListModification', function() {
    });
    describe('acMonitorExtension', function() {
    });
});