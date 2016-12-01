import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
    if(Sounds.find().count() == 0) { 
        var presetSounds = ['/fake_file.wav'];
        for(let fileName of presetSounds) {
            Sounds.insert({ 'path' : fileName, 'type' : 'presetSound' });
        }    
    }
});
