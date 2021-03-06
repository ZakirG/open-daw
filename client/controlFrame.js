function updateMasterVolume(newVolume){
    if(newVolume > 3) {
        masterSource.gainNode.gain.value = newVolume/5;
    }
    else {
        masterSource.gainNode.gain.value = newVolume/200;
    }
}

Template.controlFrame.onRendered(function(){
    new Knob(document.getElementById('master-volume-knob'), new Ui.P2());
    $('input#master-volume-knob').change(function(){
        updateMasterVolume($(this).val());
    });
    
    var dropZone = document.getElementById('drop-zone');
    var uploadForm = document.getElementById('js-upload-form');
    
    dropZone.ondrop = function(e) {
        e.preventDefault();
        this.className = 'upload-drop-zone';
        $('#drop-zone').text(e.dataTransfer.files[0].name)
        uploadedFiles = [e.dataTransfer.files[0]];
        addTrackTracker.changed();
    }

    dropZone.ondragover = function() {
        this.className = 'upload-drop-zone drop';
        return false;
    }

    dropZone.ondragleave = function() {
        this.className = 'upload-drop-zone';
        return false;
    }
});

var uploadedFiles = [];
    
var addTrackTracker = new Tracker.Dependency();

Template.controlFrame.helpers({
    inPlayMode: function(){
        playModeTracker.depend();
        return sequenceIsPlaying;
    },
    inSoloMode: function(){
        inSoloModeTracker.depend();
        return inSoloMode;
    },
    allSounds: function(){
        return AllSounds.find();
    },
    addTrackFormValid: function(){
        addTrackTracker.depend();
        var soundSource = $('#add-track-form #soundSource').val();
        var soundType = $('#add-track-form #soundType').val();
        if(soundType == 'preset' && soundSource != null && soundSource != "") return true;
        if(soundType == 'user-upload' && uploadedFiles.length > 0) return true;
        return false;
    },
    totalNumberOfBeats: function(){
        return sequenceConfiguration.totalNumberOfBeats;
    }
});

var menuOpen = false;

Template.controlFrame.events({
    'click #play': function(){
        sequenceIsPlaying = true;
        playModeTracker.changed();
        playSequence(null);
    },
    'click #pause': function(){
        sequenceIsPlaying = false;
        playModeTracker.changed();
        pauseSequence();
    },
    'click #solo-mode-toggle': function(){
        inSoloMode = !inSoloMode;
        inSoloModeTracker.changed();
    },
    'click .radio-panel': function(event){
         if(event.target.id == 'upload-tab') {
            $('#add-track-form #soundType').val('user-upload');
            $('#add-track-form #soundSource').val("");
         }
         else if(event.target.id == 'preset-tab') {
            $('#add-track-form #soundType').val('preset');
            $('#add-track-form #dLabel .dropdown-text').prop('innerText', 'Select a preset');
         }
         addTrackTracker.changed();
    },
    'click li.sound-preset': function(event){
        $('#add-track-form #dLabel .dropdown-text').prop('innerText', event.target.text);
        $('#add-track-form #soundSource').val(event.target.id);
        $('#add-track-form #soundType').val('preset');
        addTrackTracker.changed();
    },
    'hidden.bs.modal #addTrackModal': function(event) {
        $('#drop-zone').text('Just drag and drop a file here');
    },
    'click #create-track-submit' : function(event) {
        event.preventDefault();
        var soundType = $('#add-track-form #soundType').val();
        if(soundType == 'preset') {
            var soundSource = $('#add-track-form #soundSource').val();
            var soundChosen = AllSounds.findOne({'_id' : soundSource});
            var newSound = SelectedSounds.insert(soundChosen);
            audioSources[newSound] = new Source(audioCtx, audioTagFor(newSound)[0], masterSource);
            $('#addTrackModal').modal('hide');
            $('#add-track-form #dLabel .dropdown-text').prop('innerText', 'Select a preset');
            $('#add-track-form #soundSource').val("");
            $('#add-track-form #soundType').val("");
            addTrackTracker.changed();
        }
        else {
            var blob = window.URL || window.webkitURL;
            fileURL = blob.createObjectURL(uploadedFiles[0]);
            
            var userSound = { 'type' : 'userUploadedSound', 
                            'name' : uploadedFiles[0].name, 
                            'sequenceSteps' : defaultSequence,
                            'path' : fileURL };
            
            var userSoundId = SelectedSounds.insert(userSound);
            audioSources[userSoundId] = new Source(audioCtx, audioTagFor(userSoundId)[0], masterSource);
            uploadedFiles = [];
            $('#js-upload-files').val(null)
            $('#addTrackModal').modal('hide');
            addTrackTracker.changed();
        }
    },
    'change input#js-upload-files': function(event){
        var files = document.getElementById('js-upload-files').files;
        if(files.length > 0) {
            uploadedFiles = [files[0]];
        }
        addTrackTracker.changed();
    },
    'click #clear-sequence-button': function(){
        clearSequence();
    },
    'click #bounce-sequence-button': function(){
        sequenceIsPlaying = false;
        playModeTracker.changed();
        pauseSequence();
        bounceSequence();
    },
    'click #title-bar button': function(){
        if(!menuOpen) {
            $('#title-bar button').on('mouseover', function(){
                $(this).click();
            });
            menuOpen = true;
        }
    },
    'focusout #title-bar': function(event){
        if(event.relatedTarget == null || (!$(event.relatedTarget).hasClass('menu-button') && !$(event.relatedTarget).hasClass('app-menu-button'))) {
            menuOpen = false;
            $('#title-bar button').off();
        }
    },
    'shown.bs.modal #bounceModal': function(){
        $('#download-bounce').addClass('disabled');
    }
});