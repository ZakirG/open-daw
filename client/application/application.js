var sequenceIsPlaying;
var playModeTracker = new Tracker.Dependency();

var timeState = [1, 0, 0, 0, 0, 0, 0, 0];
var timeStateTracker = new Tracker.Dependency();

Template.application.onRendered(function(){    
   sequenceIsPlaying = false;
});

Template.application.helpers({
    selectedSounds: function(){
        return SelectedSounds.find();
    }
});

Template.controlFrame.helpers({
    inPlayMode: function(){
        playModeTracker.depend();
        return sequenceIsPlaying;
    }
});

Template.controlFrame.events({
    'click #play': function(){
        sequenceIsPlaying = true;
        playModeTracker.changed();
        playSequence();
    },
    'click #pause': function(){
        sequenceIsPlaying = false;
        playModeTracker.changed();
    },
    'click #add-track' : function() {
        SelectedSounds.insert(strongKick); // When a user creates a new track, the kick will be the default sound.
    } 
});

// Plays the user-generated sequence
function playSequence() {
    var bpm = $('#tempo').val();
    // We treat each sequence step as a 16th note
    var timeBetweenSteps = ((60 / bpm) * 1000) / 2; // in milliseconds
    sequenceConfiguration = {
        beatNumber : 0, 
        totalNumberOfBeats : 8,
        timeBetweenSteps : timeBetweenSteps,
        totalNumberOfBeats : 8
    }
    tempoStep(SelectedSounds.find(), sequenceConfiguration);
}

// Plays all tracks with events at the given step and set up the next step
function tempoStep(selectedSoundsCursor, sequenceConfiguration) {
    timeState = Array.apply(null, Array(8)).map(Number.prototype.valueOf,0); // array of 8 zeros for a default sequence;
    timeState[sequenceConfiguration.beatNumber] = 1;
    timeStateTracker.changed();
    
    if(!sequenceIsPlaying) {
        return;
    }
    selectedSoundsCursor.forEach(function(track){
        if(track.sequenceSteps[sequenceConfiguration.beatNumber] && !track.muted) {
            playSound(track._id);
        }
    });
    sequenceConfiguration.beatNumber++;
    if(sequenceConfiguration.beatNumber >= sequenceConfiguration.totalNumberOfBeats) { 
        sequenceConfiguration.beatNumber = 0;
    }
    setTimeout( 
        (tempoStep).bind(undefined, SelectedSounds.find(), sequenceConfiguration) 
        , sequenceConfiguration.timeBetweenSteps
    );
}
// Plays the sound associated with a given track
function playSound(selectedSoundId) {
    var audioTag = $('#audio-' + selectedSoundId);
    if (!audioTag.paused) {
        audioTag.prop('currentTime', 0);
    }
    audioTag.trigger('play');
}

function updateSoundVolume(selectedSoundId, newVolume){
    $('audio#audio-' + selectedSoundId).prop('volume',  newVolume/10);
}

Template.track.onRendered(function(){
    var selectedSoundId = Template.currentData()._id;
    new Knob(document.getElementById('volume-knob-' + selectedSoundId), new Ui.P2());
    $('input#volume-knob-' + selectedSoundId).change(function(){
        updateSoundVolume(selectedSoundId, $(this).val());
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
        if(newSequenceSteps[event.target.name] && !selectedSound.muted) {
            playSound(event.target.id);
        }
        
        SelectedSounds.update({_id : event.target.id} , {$set : {'sequenceSteps' : newSequenceSteps}});
    },
    'click .mute-button': function(event){
        var newMuteState = !!!SelectedSounds.findOne({_id : event.target.id}).muted;
        SelectedSounds.update({_id : event.target.id} , {$set : {'muted' : newMuteState}});
    },
    'change .sound-select': function(event){
        var newSound = AllSounds.findOne({'path' : $(event.target).val()});
        SelectedSounds.update({_id : event.target.id}, {$set : 
            {'path' : newSound.path  , 'name' : newSound.name }
        });
        $('audio#audio-' + event.target.id).trigger('load'); // Reload the audio whose source has changed
    }
});

