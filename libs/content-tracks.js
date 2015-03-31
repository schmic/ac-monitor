var ac = require('ac-server-ctrl');
var fs = require('fs');
var path = require('path');

var tracks = {};
require('glob')('**/ui_track.json', { cwd: ac.env.getTracksPath() }, function(err, files) {
  files.forEach(function(file) {
    fs.readFile(path.join(ac.env.getTracksPath(), file), { encoding: 'UTF-8'}, function(err, data) {
      data = JSON.parse(data.replace(/(\r\n|\n|\r|\t)/gm,""));
      var splits = file.split("/");
      var trackName = splits.length === 3 ? splits[0] : splits[0] + '-' + splits[2];
      tracks[trackName] = {
        name : data.name
      }
    });
  })
});

var getName = function(name) {
    return name in tracks ? tracks[name].name : name;
};

var getDescription = function(name) {
    return name in tracks ? tracks[name].description : undefined;
};

var getAll = function() {
  return tracks;
};

module.exports = {
    getAll: getAll,
    getName: getName,
    getDescription: getDescription
};
