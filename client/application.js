Template.application.onRendered(function(){    
   
});

Template.application.helpers({
    selectedSounds: function(){
        return SelectedSounds.find();
    }
});

Template.track.helpers({
    otherSounds: function(thisSoundsName){
        return AllSounds.find({name : {$ne : thisSoundsName}});
    },
    stepIsChecked: function(stepNumber, trackId) {
        return !!(SelectedSounds.findOne({_id : trackId}).sequenceSteps[stepNumber]);
    }
});

Template.track.events({
    'click .delete-button': function(event){
        SelectedSounds.remove({_id: event.target.name});
    },
    'click .sequence-step': function(event){
        var newSequenceSteps = SelectedSounds.findOne({_id : event.target.id}).sequenceSteps;
        newSequenceSteps[event.target.name] = 1 - newSequenceSteps[event.target.name];
        SelectedSounds.update({_id : event.target.id} , {$set : {'sequenceSteps' : newSequenceSteps}});
    },
    'click .mute-button': function(event){
        var newMuteState = !!!SelectedSounds.findOne({_id : event.target.id}).muted;
        SelectedSounds.update({_id : event.target.id} , {$set : {'muted' : newMuteState}});
    }
});