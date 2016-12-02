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
    }
});

Template.track.events({
    'click .delete-button': function(event){
        SelectedSounds.remove({_id: event.target.name});
    }
});