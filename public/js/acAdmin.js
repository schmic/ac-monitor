function getContentType() {
    return $('#contentname').attr('name');
}

function checkUploadForm() {
    var type = getContentType();
    checkContentName(type);
    checkContentFiles(type);
}

function checkContentName(type) {
    window.t ? clearTimeout(window.t) : undefined;

    window.t = setTimeout(
        function() {
            var wsfunc = 'admin.'+type+'.validate';
            var name = $('#contentname').val();
            if(name.length === 0) {
                cbCheckContentName({valid: false});
                return;
            }
            socket.emit(wsfunc, { name: name }, cbCheckContentName);
        }, 500);
}

function checkContentFiles(type) {
    var uploadFiles = {
        'cars': [ 'small_preview.png' ],
        'tracks': [ 'surfaces.ini' ],
        'presets': [ 'server_cfg.ini', 'entry_list.ini' ]
    };

    var filelist = getUploadFiles();

    var files = [];
    for (var i = 0, f; f = filelist[i]; i++) {
        files.push(f.name);
    }

    var missingFiles = [];
    uploadFiles[type].forEach(function(f) {
        if(-1 === files.indexOf(f)) {
            missingFiles.push(f);
        }
    });

    cbCheckContentFiles(missingFiles.length ? false : true);
}

function cbCheckContentFiles(valid) {
    setFormFieldState('#contentfilesfeedback', valid);
}

function cbCheckContentName(data) {
    setFormFieldState('#contentnamefeedback', data.valid);
}

function setFormFieldState(selector, isValid) {
    if(isValid) {
        $(selector).addClass('glyphicon-ok').removeClass('glyphicon-remove');
        $(selector).parent().addClass('has-success').removeClass('has-error');
    }
    else {
        $(selector).addClass('glyphicon-remove').removeClass('glyphicon-ok');
        $(selector).parent().addClass('has-error').removeClass('has-success');
    }
    checkUploadButtonState();
}

function checkUploadButtonState() {
    if($('#contentnamefeedback').hasClass('glyphicon-ok') && $('#contentfilesfeedback').hasClass('glyphicon-ok')) {
        $('#uploadbutton').prop( "disabled", false );
    }
    else {
        $('#uploadbutton').prop( "disabled", true );
    }

}

function handleDelete(name) {
    var type = getContentType();
    var wsfunc = 'admin.'+type+'.delete';

    var data = {};

    data.name = name;

    socket.emit(wsfunc, data, socket.cb);
}

function handleUpload() {
    var type = getContentType();
    var wsfunc = 'admin.'+type+'.upload';

    var data = { name: undefined, content : {}};
    data.name = $('#contentname').val();


    var filelist = getUploadFiles();

    function readFile(index) {
        if(index >= filelist.length)
            return;
        var file = filelist[index];
        var reader = new FileReader();
        reader.onload = function(e) {
            data.content[file.name] = e.target.result;
            check();
        };
        reader.readAsText(file);
        readFile(++index);
    }
    readFile(0);

    function check() {  // wait for file readers to complete
        if(Object.keys(data.content).length === filelist.length) {
            socket.emit(wsfunc, data, socket.cb);
        }
    }
}

function getUploadFiles() {
    return $('#files').prop('files');
}

function handleStartServer(presetName) {
    var wsfunc = 'admin.server.start';
    var data = { name: presetName };

    socket.emit(wsfunc, data, socket.cb);
}

function handleStopServer(presetName) {
    var wsfunc = 'admin.server.stop';
    var data = { name: presetName };

    socket.emit(wsfunc, data, socket.cb);
}

function handleCreateEvent() {
    var wsfunc = 'admin.event.save';
    var data = {};
    $('#adminEventsForm')
        .find(':input')
        .each(function readFieldValue(idx, field) {
            if(field.id.match(/^event/))
                data[field.id.replace(/^event/, '')] = $(field).val().trim();
        });

    socket.emit(wsfunc, data, socket.cb);
}

function handleCopyEvent(event_id) {
    $('#adminEventsForm')
        .find(':input')
        .each(function readFieldValue(idx, field) {
            var tdField = field.id.replace(/^event/, '#event_'+event_id+'_');
            $(field).val($(tdField).html());
        });
}

function handleStartEvent(event_id) {
    var wsfunc = 'admin.event.start';
    var data = { id: event_id };
    socket.emit(wsfunc, data, socket.cb);
}

function handleRemoveEvent(event_id) {
    var wsfunc = 'admin.event.remove';
    var data = { id: event_id };
    socket.emit(wsfunc, data, socket.cb);
}

