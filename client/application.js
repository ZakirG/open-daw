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

// Checks if solo mode should be turned off (none of the tracks are soloed)
unsoloAll = function(){
    SelectedSounds.find({'soloed' : true}).forEach(function(sound){
        SelectedSounds.update({_id: sound._id} ,  {$set : {'soloed' : false}});
    });
};