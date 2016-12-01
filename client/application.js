Template.application.onRendered(function(){    
    
});

Template.application.helpers({
    sounds: function(){
        return Sounds.find();
    }
});