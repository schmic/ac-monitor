var ac = require('ac-server-ctrl');

ac.on(ac.events.server.start, function (server) {
    server.on(ac.events.car.connect, function (car) {
        console.log(ac.events.car.connect, car);
    });

    server.on(ac.events.car.disconnect, function (car) {
        console.log(ac.events.car.disconnect, car);
    });
});

module.exports = {};