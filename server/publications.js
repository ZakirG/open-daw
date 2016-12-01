Meteor.publish('sounds', function(){ 
    return Sounds.find(); 
});