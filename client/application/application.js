sequenceIsPlaying = false;
playModeTracker = new Tracker.Dependency();

timeState = [1, 0, 0, 0, 0, 0, 0, 0];
timeStateTracker = new Tracker.Dependency();

inSoloMode = false;
inSoloModeTracker = new Tracker.Dependency();

audioCtx = new (window.AudioContext || window.webkitAudioContext)();
masterSource = new MasterSource(audioCtx);
audioSources = {};

userSounds = {};

Template.application.onRendered(function(){    
   sequenceIsPlaying = false;
   SelectedSounds.find().forEach(function(sound){
        audioSources[sound._id] = new Source(audioCtx, audioTagFor(sound._id)[0], masterSource);  
    });
});

Template.application.helpers({
    selectedSounds: function(){
        return SelectedSounds.find();
    }
});

function calculateStepDelayFromTempo(){
     var bpm = $('#tempo').val();
    // We treat each sequence step as a 16th note
    var timeBetweenSteps = ((60 / bpm) * 1000) / 2; // in milliseconds
    return timeBetweenSteps;
}

// Plays the user-generated sequence
playSequence = function() {
    var timeBetweenSteps = calculateStepDelayFromTempo();
    sequenceConfiguration = {
        beatNumber : 0, 
        totalNumberOfBeats : 8,
        timeBetweenSteps : timeBetweenSteps,
        totalNumberOfBeats : 8
    }
    tempoStep(SelectedSounds.find(), sequenceConfiguration);
}

// Plays all tracks with events at the given step and set up the next step
tempoStep = function(selectedSoundsCursor, sequenceConfiguration) {
    timeState = Array.apply(null, Array(8)).map(Number.prototype.valueOf,0); // array of 8 zeros for a default sequence;
    timeState[sequenceConfiguration.beatNumber] = 1;
    timeStateTracker.changed();
    
    if(!sequenceIsPlaying) {
        return;
    }
    selectedSoundsCursor.forEach(function(track){
        if(track.sequenceSteps[sequenceConfiguration.beatNumber] && !trackIsDisabled(track)) {
            playSound(track._id, track.type);
        }
    });
    sequenceConfiguration.beatNumber++;
    
    // If the user is not currently editing the tempo, update the tempo
    if(!$('#tempo').is(":focus")) {
        sequenceConfiguration.timeBetweenSteps = calculateStepDelayFromTempo();
    }
    
    if(sequenceConfiguration.beatNumber >= sequenceConfiguration.totalNumberOfBeats) { 
        sequenceConfiguration.beatNumber = 0;
    }
    setTimeout( 
        (tempoStep).bind(undefined, SelectedSounds.find(), sequenceConfiguration) 
        , sequenceConfiguration.timeBetweenSteps
    );
}

// Returns true if track playback has been temporarily disabled by solo/mute
trackIsDisabled = function(selectedSound) {
    inSoloModeTracker.depend();
    return selectedSound.muted || ( !selectedSound.soloed && inSoloMode );
}

// Plays the sound associated with a given track
playSound = function(selectedSoundId, selectedSoundType) {
    if(audioSources[selectedSoundId].gainNode.gain.value > 0 && masterSource.gainNode.gain.value > 0) {
        
            var audioTag = audioTagFor(selectedSoundId);
            audioTag.prop('currentTime', 0);
            audioTag.trigger('play');
        
    }
}

function updateSoundVolume(selectedSoundId, newVolume){
    audioSources[selectedSoundId].gainNode.gain.value = newVolume/10;
}

function updateSoundPan(selectedSoundId, newPan){
    audioSources[selectedSoundId].panNode.pan.value = newPan/10;
}

Template.track.onRendered(function(){
    var selectedSoundId = Template.currentData()._id;
    new Knob(document.getElementById('volume-knob-' + selectedSoundId), new Ui.P2());
    $('input#volume-knob-' + selectedSoundId).change(function(){
        updateSoundVolume(selectedSoundId, $(this).val());
    });
    new Knob(document.getElementById('pan-knob-' + selectedSoundId), new Ui.P2());
    $('input#pan-knob-' + selectedSoundId).change(function(){
        updateSoundPan(selectedSoundId, $(this).val());
    });
});

Template.track.helpers({
    otherSounds: function(thisSoundsPath){
        return AllSounds.find({path : {$ne : thisSoundsPath}});
    },
    stepIsChecked: function(stepNumber, trackId) {
        return !!(SelectedSounds.findOne({_id : trackId}).sequenceSteps[stepNumber]);
    },
    timeStepIsActive: function(stepNumber){
        timeStateTracker.depend();
        playModeTracker.depend();
        return timeState[stepNumber] && sequenceIsPlaying;
    }
});

Template.track.events({
    'click .delete-button': function(event){
        SelectedSounds.remove({_id: event.target.name});
    },
    'click .sequence-step': function(event){
        var selectedSound = SelectedSounds.findOne({_id : event.target.id})
        var newSequenceSteps = selectedSound.sequenceSteps;
        newSequenceSteps[event.target.name] = 1 - newSequenceSteps[event.target.name];
        
        // Play the sound the user selected, if it was toggled to true
        if(newSequenceSteps[event.target.name] && !trackIsDisabled(selectedSound)) {
            playSound(event.target.id, selectedSound.type);
        }
        
        SelectedSounds.update({_id : event.target.id} , {$set : {'sequenceSteps' : newSequenceSteps}});
    },
    'click .mute-button': function(event){
        var newMuteState = !!!SelectedSounds.findOne({_id : event.target.id}).muted;
        SelectedSounds.update({_id : event.target.id} , {$set : {'muted' : newMuteState}});
    },
    'click .solo-button': function(event){
        var newSoloState = !!!SelectedSounds.findOne({_id : event.target.id}).soloed;
        SelectedSounds.update({_id : event.target.id} , {$set : {'soloed' : newSoloState}});
        
        if (!inSoloMode) { 
            inSoloMode = true;
            inSoloModeTracker.changed();
        }
        else {
            updateSoloMode();
        }
        
    },
    'change .sound-select': function(event){
        var newSound = AllSounds.findOne({'path' : $(event.target).val()});
        SelectedSounds.update({_id : event.target.id}, {$set : 
            {'path' : newSound.path  , 'name' : newSound.name }
        });
        $('audio#audio-' + event.target.id).trigger('load'); // Reload the audio whose source has changed
    }
});

// Helpers to be moved to a new file:
audioTagFor = function(selectedSoundId) {
    return $('#audio-' + selectedSoundId);
};

// Checks if solo mode should be turned off (none of the tracks are soloed)
updateSoloMode = function(){
    var soundsSoloed = SelectedSounds.find({'soloed' : true}).count();
    if(soundsSoloed == 0) {
        inSoloMode = false;
        inSoloModeTracker.changed();
    }
};