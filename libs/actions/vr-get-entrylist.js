var path = require('path');
var fs = require('fs');
var req = require('request');
var cfg = require('config');

var options = {
    "url": cfg.get('vr.entrylist.url'),
    "method": "GET",
    "json": false
};

var getEntryList = function(parms, preset) {
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
                var entryListFile = path.join(preset.presetPath, 'entry_list.ini');
                console.log('write it to', entryListFile);
                fs.writeFileSync(entryListFile, entryListData);
            });
        })
        .on('error', function(err) {
            console.error(err);
        });
};

module.exports = getEntryList;
