Meteor.publish('allSounds', function(){
    return AllSounds.find();
});