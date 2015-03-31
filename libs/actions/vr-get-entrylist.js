var path = require('path');
var fs = require('fs');
var req = require('request');
var cfg = require('config');
var ac = require('ac-server-ctrl');

var options = {
    "url": cfg.get('vr.entrylist.url'),
    "method": "GET",
    "json": false
};

var getEntryList = function(parms, presetName, cb) {
    if(options.url === undefined) {
        return;
    }

    parms = JSON.parse(parms);
    Object.keys(parms).forEach(function(key) {
        options.url += '&' + key + '=' + parms[key];
    });

    req.get(options)
        .on('response', function handleRepsonse(resp) {
            var entryListData = "";
            resp.on('data', function fetchData(data) {
                entryListData += data;
            });
            resp.on('end', function handleData() {
                var presetPath = ac.env.getPreset(presetName).presetPath;
                var entryListFile = path.join(presetPath, 'entry_list.ini');
                fs.writeFileSync(entryListFile, entryListData);
                console.log('wrote', options.url, 'to', entryListFile);

                cb(presetName);
            });
        })
        .on('error', function(err) {
            console.error(err);
        });
};

module.exports = getEntryList;
