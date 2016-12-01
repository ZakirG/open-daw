Template.application.onRendered(function(){    
   
    
});

Template.application.helpers({
    selectedSounds: function(){
        return SelectedSounds.find();
    }
});

Template.track.helpers({
    
});

Template.track.events({
    'click .delete-button': function(event){
        console.log(event.target.name);
        SelectedSounds.remove({_id: event.target.name});
    }
});