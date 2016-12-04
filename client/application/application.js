Template.application.onRendered(function(){    
   
});

Template.application.helpers({
    selectedSounds: function(){
        return SelectedSounds.find();
    }
});

function playSound(selectedSoundId) {
    var elementString = 'audio#' + selectedSoundId;
    $(elementString).trigger('play');
}

Template.track.onRendered(function(){
    // $(function() {
//         $(".dial").knob({
//             'min':0,
//             'max':100,
//             'angleOffset': 225,
//             'angleArc': 270,
//             'fgColor':"#00E1FF",
//             'height': '90px'
//         });
//     });
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
        var selectedSound = SelectedSounds.findOne({_id : event.target.id})
        var newSequenceSteps = selectedSound.sequenceSteps;
        newSequenceSteps[event.target.name] = 1 - newSequenceSteps[event.target.name];
        SelectedSounds.update({_id : event.target.id} , {$set : {'sequenceSteps' : newSequenceSteps}});
        // Play the sound the user selected, if it was toggled to true
        console.log(newSequenceSteps[event.target.name]);
        console.log(event.target.id);
        if(newSequenceSteps[event.target.name] && !selectedSound.muted) {
            playSound(event.target.id);
        }
    },
    'click .mute-button': function(event){
        var newMuteState = !!!SelectedSounds.findOne({_id : event.target.id}).muted;
        SelectedSounds.update({_id : event.target.id} , {$set : {'muted' : newMuteState}});
    }
});

