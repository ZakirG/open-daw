defaultSequence = Array.apply(null, Array(8)).map(Number.prototype.valueOf,0); // array of 8 zeros for a default sequence

 // All sounds presets available
subbassF = { 'path' : 'sounds/808F.wav', 'type' : 'presetSound', 'name' : '808 - F', 'sequenceSteps' : defaultSequence};
basicClap = { 'path' : 'sounds/basicClap.wav', 'type' : 'presetSound', 'name' : 'Basic Clap', 'sequenceSteps' : defaultSequence};
basicHiHat = { 'path' : 'sounds/basicHiHat.wav', 'type' : 'presetSound', 'name' : 'Basic HiHat', 'sequenceSteps' : defaultSequence};
basicSnare = { 'path' : 'sounds/basicSnare.wav', 'type' : 'presetSound', 'name' : 'Basic Snare', 'sequenceSteps' : defaultSequence};
chantBreath = { 'path' : 'sounds/chantBreath.wav', 'type' : 'presetSound', 'name' : 'Chant - Breath', 'sequenceSteps' : defaultSequence};
cowbell = { 'path' : 'sounds/cowbell.wav', 'type' : 'presetSound', 'name' : 'Cowbell', 'sequenceSteps' : defaultSequence};
distortedKick = { 'path' : 'sounds/distortedKick.wav', 'type' : 'presetSound', 'name' : 'Distorted Kick', 'sequenceSteps' : defaultSequence};
marioCoin = { 'path' : 'sounds/marioCoin.wav', 'type' : 'presetSound', 'name' : 'Mario Coin', 'sequenceSteps' : defaultSequence};
deepKick = { 'path' : 'sounds/basicKick.wav', 'type' : 'presetSound', 'name' : 'Deep Kick', 'sequenceSteps' : defaultSequence};
strongTom = { 'path' : 'sounds/strongTom.wav', 'type' : 'presetSound', 'name' : 'Strong Tom', 'sequenceSteps' : defaultSequence};
tabla = { 'path' : 'sounds/tabla.wav', 'type' : 'presetSound', 'name' : 'Tabla', 'sequenceSteps' : defaultSequence};
woodBlock = { 'path' : 'sounds/woodBlock.wav', 'type' : 'presetSound', 'name' : 'Wood Block', 'sequenceSteps' : defaultSequence};
openHat = { 'path' : 'sounds/openHat.wav', 'type' : 'presetSound', 'name' : 'Open Hat', 'sequenceSteps' : defaultSequence};
vocalChantATL = { 'path' : 'sounds/vocalChantATL.wav', 'type' : 'presetSound', 'name' : 'Chant - Zaytoven', 'sequenceSteps' : defaultSequence};
bongoHit = { 'path' : 'sounds/bongoHit.wav', 'type' : 'presetSound', 'name' : 'Bongo (1)', 'sequenceSteps' : defaultSequence};
bongoHit2 = { 'path' : 'sounds/bongoHit2.wav', 'type' : 'presetSound', 'name' : 'Bongo (2)', 'sequenceSteps' : defaultSequence};

AllSounds = new Mongo.Collection('allSounds');

// Load a few sound presets for the user.
SelectedSounds = new Mongo.Collection(null);
if(SelectedSounds.find().count() == 0) { 
    SelectedSounds.insert(deepKick);
    SelectedSounds.insert(woodBlock);
    SelectedSounds.insert(bongoHit);
    SelectedSounds.insert(bongoHit2);
    SelectedSounds.insert(basicSnare);
    SelectedSounds.insert(marioCoin);
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