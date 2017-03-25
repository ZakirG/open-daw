import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
   
});

AllSounds.remove({});
 // All sounds presets available
if(AllSounds.find().count() == 0) { 
    AllSounds.insert(basicClap);
    AllSounds.insert(basicHiHat);
    AllSounds.insert(basicSnare);
    AllSounds.insert(deepKick);
    AllSounds.insert(strongTom);
    AllSounds.insert(openHat);
    AllSounds.insert(vocalChantATL);
    AllSounds.insert(woodBlock);
    AllSounds.insert(cowbell);
    AllSounds.insert(distortedKick);
    AllSounds.insert(chantBreath);
    AllSounds.insert(subbassF);
    AllSounds.insert(marioCoin);
    AllSounds.insert(bongoHit);
    AllSounds.insert(bongoHit2);
}