/**
 * Copyright (c) 2014 Michael Scherer // Virtual Racing e.V
 * Released under The MIT License.
 */

function showHelp(msg, returnCode) {
    returnCode = returnCode || 0;
    out = (returnCode == 0) ? console.log : console.error;

    if (msg) {
        out('##', msg, '\n');
    }

    out('usage: acCtrl.js <action> [opts]\n',
        '\n',
        'actions:', 'list', 'start', '\n',
        'opts:', '-h/--help', '-l/--list', '-p/--preset', '-v/--verbose');

    if (returnCode > 0)
        process.exit(returnCode)
}

var actions = {
    'list': function () {
        console.log('action.list', 'argv:', argv);
        console.log('==== Presets ====');
        cfg.getPresetsNames('').some(function (preset) {
            console.log('>', preset);
        });
    },
    'start': function () {
        console.log('action.start', 'argv:', argv);
        var server = require('./libs/server');
        server.init(cfg.getPresetName(argv.preset));
        server.start();
        process.on( 'SIGINT', function() {
            console.log( "\nGracefully shutting down from SIGINT (Ctrl-C)" );
            server.stop();
        })
    }
};

var cfg = require('config');
var argv = require('minimist')(process.argv.slice(2), {
    'string': ['preset'],
    'boolean': ['verbose', 'help'],
    'alias': {
        'p': 'preset',
        'v': 'verbose',
        'h': 'help'
    }
});
var action = argv._.shift();

if (actions.hasOwnProperty(action)) {
    actions[action]();
}
else {
    showHelp('Unknown/No action given, aborting', 1);
    process.exit(1);
}
//EOF