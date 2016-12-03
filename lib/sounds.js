defaultSequence = Array.apply(null, Array(8)).map(Number.prototype.valueOf,0); // array of 8 zeros for a default sequence

 // All sounds presets available
basicClap = { 'path' : '/sounds/basicClap.wav', 'type' : 'presetSound', 'name' : 'Basic Clap', 'sequenceSteps' : defaultSequence};
basicHiHat = { 'path' : '/sounds/basicHiHat.wav', 'type' : 'presetSound', 'name' : 'Basic HiHat', 'sequenceSteps' : defaultSequence};
strongKick = { 'path' : '/sounds/strongKick.wav', 'type' : 'presetSound', 'name' : 'Strong Kick', 'sequenceSteps' : defaultSequence};
strongTom = { 'path' : '/sounds/strongTom.wav', 'type' : 'presetSound', 'name' : 'Strong Tom', 'sequenceSteps' : defaultSequence};

AllSounds = new Mongo.Collection('allSounds');

// Load a few sound presets for the user.
SelectedSounds = new Mongo.Collection(null);
if(SelectedSounds.find().count() == 0) { 
    SelectedSounds.insert(basicClap);
    SelectedSounds.insert(basicHiHat);
    SelectedSounds.insert(strongKick);
}