var db = require('../libs/db');
var collection = db.collection('tracks');

var tracks = {}
tracks['drag400'] = "Dragstrip 400";
tracks['drag1000'] = "Dragstrip 1000";
tracks['drift'] = "Drift";
tracks['imola'] = "Imola";
tracks['magione'] = "Magione";
tracks['monza'] = "Monza";
tracks['monza66'] = "Monza '66";
tracks['mugello'] = "Mugello";
tracks['nurburgring'] = "Nürgburgring GP";
tracks['nurburgring-sprint'] = "Nürburgring Sprint";
tracks['silverstone'] = "Silverstone";
tracks['silverstone-international'] = "Silverstone International";
tracks['vallelunga'] = "Vallelunga";
tracks['vallelunga-club'] = "Vallelunga Club";
tracks['salzburgring'] = "Salzburgring";
tracks['spa'] = "Spa-Francorchamps";

var findByName = function(name) {
    return name in tracks ? tracks[name] : name;
};

module.exports = {
    findByName: findByName
};

