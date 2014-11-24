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

            this.server.on('endsession', function(session) {
                if(session.name == undefined)
                    return;
                console.log('Session', session.name, 'ends, laptimes:');
                console.log(session.laptimes);
            });

            require('../../libs/server-parser').listen(this.server);

            stream.on('end', function() {
                setTimeout(function() {
                    done();
                }, 5000);
            }.bind(this.server));
        });
    });
});