// Returns true if track playback has been temporarily disabled by solo/mute
trackIsDisabled = function(selectedSound) {
    inSoloModeTracker.depend();
    return selectedSound.muted || ( !selectedSound.soloed && inSoloMode );
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
    },
    glowSolo: function(){
        inSoloModeTracker.depend();
        return this.soloed && inSoloMode;
    },
    soloDimmedTrack: function() {
        inSoloModeTracker.depend();
        return (inSoloMode && !this.soloed);
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
            playSound(event.target.id, selectedSound.path, 0);
        }
        
        SelectedSounds.update({_id : event.target.id} , {$set : {'sequenceSteps' : newSequenceSteps}});
    },
    'click .mute-button': function(event){
        var newMuteState = !!!SelectedSounds.findOne({_id : event.target.id}).muted;
        SelectedSounds.update({_id : event.target.id} , {$set : {'muted' : newMuteState}});
    },
    'click .solo-button': function(event){
        if (!inSoloMode) { 
            unsoloAll();
            var newSoloState = !!!SelectedSounds.findOne({_id : event.target.id}).soloed;
            SelectedSounds.update({_id : event.target.id} , {$set : {'soloed' : newSoloState}});
            inSoloMode = true;
            inSoloModeTracker.changed();
        }
        else {
            var newSoloState = !!!SelectedSounds.findOne({_id : event.target.id}).soloed;
            SelectedSounds.update({_id : event.target.id} , {$set : {'soloed' : newSoloState}});
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