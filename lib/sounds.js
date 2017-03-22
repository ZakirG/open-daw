defaultSequence = Array.apply(null, Array(8)).map(Number.prototype.valueOf,0); // array of 8 zeros for a default sequence

 // All sounds presets available
basicClap = { 'path' : 'sounds/basicClap.wav', 'type' : 'presetSound', 'name' : 'Basic Clap', 'sequenceSteps' : defaultSequence};
basicHiHat = { 'path' : 'sounds/basicHiHat.wav', 'type' : 'presetSound', 'name' : 'Basic HiHat', 'sequenceSteps' : defaultSequence};
basicSnare = { 'path' : 'sounds/basicSnare.wav', 'type' : 'presetSound', 'name' : 'Basic Snare', 'sequenceSteps' : defaultSequence};
strongKick = { 'path' : 'sounds/strongKick.wav', 'type' : 'presetSound', 'name' : 'Strong Kick', 'sequenceSteps' : defaultSequence};
strongTom = { 'path' : 'sounds/strongTom.wav', 'type' : 'presetSound', 'name' : 'Strong Tom', 'sequenceSteps' : defaultSequence};
openHat = { 'path' : 'sounds/openHat.wav', 'type' : 'presetSound', 'name' : 'Open Hat', 'sequenceSteps' : defaultSequence};
vocalChantATL = { 'path' : 'sounds/vocalChantATL.wav', 'type' : 'presetSound', 'name' : 'Vocal: ATL', 'sequenceSteps' : defaultSequence};
vocalChantGo = { 'path' : 'sounds/vocalChantGo.wav', 'type' : 'presetSound', 'name' : 'Vocal: Go!', 'sequenceSteps' : defaultSequence};

AllSounds = new Mongo.Collection('allSounds');

// Load a few sound presets for the user.
SelectedSounds = new Mongo.Collection(null);
if(SelectedSounds.find().count() == 0) { 
    SelectedSounds.insert(strongKick);
    SelectedSounds.insert(basicHiHat);
    SelectedSounds.insert(basicClap);
    SelectedSounds.insert(openHat);
}

Source = function(audioCtx, audioElement, masterSource) {
    // bus setup: source -> gain -> pan -> master gain
    this.panNode = audioCtx.createStereoPanner();
    this.panNode.pan.value = 0;

    this.source = audioCtx.createMediaElementSource(audioElement);
    this.gainNode = audioCtx.createGain();
    this.gainNode.gain.value = 0.5;
    this.source.connect(this.gainNode);
    this.gainNode.connect(this.panNode);
    
    this.panNode.connect(masterSource.gainNode);
}

MasterSource = function(audioCtx) {
    this.gainNode = audioCtx.createGain();
    this.gainNode.gain.value = 0.2;
    this.gainNode.connect(audioCtx.destination);
}