 // All sounds presets available
basicClap = { 'path' : '/sounds/basicClap.wav', 'type' : 'presetSound', 'name' : 'Basic Clap'};
basicHiHat = { 'path' : '/sounds/basicHiHat.wav', 'type' : 'presetSound', 'name' : 'Basic HiHat'};
strongKick = { 'path' : '/sounds/strongKick.wav', 'type' : 'presetSound', 'name' : 'Strong Kick'};
strongTom = { 'path' : '/sounds/strongTom.wav', 'type' : 'presetSound', 'name' : 'Strong Tom'};

AllSounds = new Mongo.Collection('allSounds');

// Load a few sound presets for the user.
SelectedSounds = new Mongo.Collection(null);
if(SelectedSounds.find().count() == 0) { 
    SelectedSounds.insert(basicClap);
    SelectedSounds.insert(basicHiHat);
    SelectedSounds.insert(strongKick);
}