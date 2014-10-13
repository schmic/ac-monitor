var env = require('./env');
var printf   = require('util').format;

function deleteTrack(data, fn) {
    console.log('admin.tracks.delete', data);
    data.valid = env.deleteTrack(data.name);
    data.msg = printf('Track %s %s', data.name, data.valid ? 'deleted' : 'could not be deleted');
    fn(data);
}
function validateTrack(data, fn) {
    console.log('admin.tracks.validate', data);
    data.valid = env.hasTrack(data.name) ? false : true;
    data.msg = printf('Track %s %s', data.name, data.valid ? 'validated' : 'already exists');
    fn(data);
}
function saveTrack(data, fn) {
    console.log('admin.tracks.upload', data);
    data.valid = env.createTrack(data.name, data.content);
    data.msg = printf('Track %s %s', data.name, data.valid ? 'created' : 'could not be created');
    fn(data);
}
function deleteCar(data, fn) {
    console.log('admin.cars.delete', data);
    data.valid = env.deleteCar(data.name);
    data.msg = printf('Car %s %s', data.name, data.valid ? 'deleted' : 'could not be deleted');
    fn(data);
}
function validateCar(data, fn) {
    console.log('admin.cars.validate', data);
    data.valid = env.hasCar(data.name) ? false : true;
    data.msg = printf('Car %s %s', data.name, data.valid ? 'validated' : 'already exists');
    fn(data);
}
function saveCar(data, fn) {
    console.log('admin.cars.upload', data);
    data.valid = env.createCar(data.name, data.content);
    data.msg = printf('Car %s %s', data.name, data.valid ? 'created' : 'could not be created');
    fn(data);
}
function deletePreset(data, fn) {
    data.valid = env.deletePreset(data.name);
    data.msg = printf('Preset %s %s', data.name, data.valid ? 'deleted' : 'could not be deleted');
    console.log('admin.presets.delete', data);
    fn(data);
}
function validatePreset(data, fn) {
    data.valid = env.hasPreset(data.name) ? false : true;
    data.msg = printf('Preset %s %s', data.name, data.valid ? 'validated' : 'already exists');
    console.log('admin.presets.validate', data);
    fn(data);
}
function savePreset(data, fn) {
    data.valid = env.createPreset(data.name, data.content);
    data.msg = printf('Preset %s %s', data.name, data.valid ? 'created' : 'could not be created');
    console.log('admin.presets.upload', data);
    fn(data);
}
function startServer(data, fn) {
    data.valid = require('./server-handler').start(data.name);
    data.msg = printf('Preset %s %s', data.name, data.valid ? 'started' : 'could not be started');
    console.log('admin.server.start', data);
    fn(data);
}
function stopServer(data, fn) {
    data.valid = require('./server-handler').stop(data.name);
    data.msg = printf('Preset %s %s', data.name, data.valid ? 'stopped' : 'could not be stopped');
    console.log('admin.server.stop', data);
    fn(data);
}
module.exports = function(socket) {
    socket.on('admin.tracks.delete', deleteTrack);
    socket.on('admin.tracks.validate', validateTrack);
    socket.on('admin.tracks.upload', saveTrack);
    socket.on('admin.cars.delete', deleteCar);
    socket.on('admin.cars.validate', validateCar);
    socket.on('admin.cars.upload', saveCar);
    socket.on('admin.presets.delete', deletePreset);
    socket.on('admin.presets.validate', validatePreset);
    socket.on('admin.presets.upload', savePreset);
    socket.on('admin.server.start', startServer);
    socket.on('admin.server.stop', stopServer);
};