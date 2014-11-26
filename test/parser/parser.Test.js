var path = require('path');
var assert = require('assert');

describe('Parser', function() {
    before(function() {
        this.server = require('../../libs/server')('testEvent01');
    });
    // after(function() {});
    // beforeEach(function() {});
    // afterEach(function() {});
    describe('objectCheck', function() {
        it('should not be undefined', function() {
            assert.notEqual(undefined, this.server);
        });
    });

    describe('inputstream01.log', function() {
        it('should be parsed', function(done) {
            this.timeout(10000);
            var stream = require('fs').createReadStream(path.join('test', 'acData', 'inputstream01.log'));
            this.server.proc = {
                "stdout": stream,
                "stderr": require('stream').Transform()
            };

            this.server.on('bestlap', function(driverObject) {
                console.log('best lap for', driverObject.driver, 'with', driverObject.laptime);
            });

            this.server.on('endsession', function(session) {
                if(session.name == undefined)
                    return;
                console.log('Session', session.name, 'ends, laptimes:');
                console.log(session.laptimes);
            });

            this.server.on('stopserver', function() {
                stream.destroy();
                setTimeout(function() {
                    done();
                }, 2000);
            });

            require('../../libs/server-parser').listen(this.server);
        });
    });
});