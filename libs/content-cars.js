var ac = require('ac-server-ctrl');
var fs = require('fs');
var path = require('path');

var cars = {};
require('glob')('**/ui_car.json', { cwd: ac.env.getCarsPath() }, function(err, files) {
  files.forEach(function(file) {
    fs.readFile(path.join(ac.env.getCarsPath(), file), { encoding: 'UTF-8'}, function(err, data) {
      data = JSON.parse(data.replace(/(\r\n|\n|\r|\t)/gm,""));
      var carName = file.split("/").shift();
      cars[carName] = {
        name : data.name
      }
    });
  })
});

var getName = function(name) {
    return name in cars ? cars[name].name : name;
};

var getDescription = function(name) {
    return name in cars ? cars[name].description : undefined;
};

var getAll = function() {
  return cars;
};

module.exports = {
    getAll: getAll,
    getName: getName,
    getDescription: getDescription
};
