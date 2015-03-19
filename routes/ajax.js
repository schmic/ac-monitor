var router = require('express').Router();
var ac = require('ac-server-ctrl');

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
    //res.render('api/servers', { layout: false, server: server });
    res.json(servers);
});

router.get('/servers/:preset', function(req, res) {
    var presetName = req.params.preset;
    var server = {};
   	server.preset = ac.servers[presetName].preset;
   	server.session = ac.servers[presetName].session;
    //res.render('api/server', { layout: false, server: server });
    res.json(server);
});

module.exports = router;
