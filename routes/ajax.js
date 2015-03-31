var router = require('express').Router();
var ac = require('ac-server-ctrl');

router.get('*', function(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.type('application/json');
  next();
});

router.get('/content', function(req, res) {
  res.json({
    cars: require('../libs/car').getAll(),
    tracks: require('../libs/track').getAll()
  });
});

router.get('/servers', function(req, res) {
    var servers = [];
    for(var presetName in ac.servers) {
        ac.status(presetName, function(presetName, status) {
            if(status) {
                var server = ac.servers[presetName];
                servers.push({
                    preset: server.preset.presetName,
                    name: server.preset.serverName
                });
            }
        });
    }
    res.json(servers);
});

router.get('/servers/:preset', function(req, res) {
    var presetName = req.params.preset;
    var server = {};
   	server.preset = ac.servers[presetName].preset;
   	server.session = ac.servers[presetName].session;
    res.json(server);
});

module.exports = router;
