import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
   
});

 // All sounds presets available
if(AllSounds.find().count() == 0) { 
    AllSounds.insert(basicClap);
    AllSounds.insert(basicHiHat);
    AllSounds.insert(basicSnare);
    AllSounds.insert(strongKick);
    AllSounds.insert(strongTom);
    AllSounds.insert(openHat);
    AllSounds.insert(vocalChantATL);
    AllSounds.insert(vocalChantGo);
}