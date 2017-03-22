sequenceIsPlaying = false;
playModeTracker = new Tracker.Dependency();

timeState = [1, 0, 0, 0, 0, 0, 0, 0];
timeStateTracker = new Tracker.Dependency();

inSoloMode = false;
inSoloModeTracker = new Tracker.Dependency();

audioCtx = new (window.AudioContext || window.webkitAudioContext)();
masterSource = new MasterSource(audioCtx);
audioSources = {};

userSounds = {};

Template.application.onRendered(function(){    
   sequenceIsPlaying = false;
   SelectedSounds.find().forEach(function(sound){
        audioSources[sound._id] = new Source(audioCtx, audioTagFor(sound._id)[0], masterSource);  
    });
});

Template.application.helpers({
    selectedSounds: function(){
        return SelectedSounds.find();
    }
});

function calculateStepDelayFromTempo(){
     var bpm = $('#tempo').val();
    // We treat each sequence step as a 16th note
    var timeBetweenSteps = ((60 / bpm) * 1000) / 2; // in milliseconds
    return timeBetweenSteps;
}

// Plays the user-generated sequence
playSequence = function() {
    var timeBetweenSteps = calculateStepDelayFromTempo();
    sequenceConfiguration = {
        beatNumber : 0, 
        totalNumberOfBeats : 8,
        timeBetweenSteps : timeBetweenSteps,
        totalNumberOfBeats : 8
    }
    tempoStep(SelectedSounds.find(), sequenceConfiguration);
}

// Plays all tracks with events at the given step and set up the next step
tempoStep = function(selectedSoundsCursor, sequenceConfiguration) {
    timeState = Array.apply(null, Array(8)).map(Number.prototype.valueOf,0); // array of 8 zeros for a default sequence;
    timeState[sequenceConfiguration.beatNumber] = 1;
    timeStateTracker.changed();
    
    if(!sequenceIsPlaying) {
        return;
    }
    selectedSoundsCursor.forEach(function(track){
        if(track.sequenceSteps[sequenceConfiguration.beatNumber] && !trackIsDisabled(track)) {
            playSound(track._id, track.path);
        }
    });
    sequenceConfiguration.beatNumber++;
    
    // If the user is not currently editing the tempo, update the tempo
    if(!$('#tempo').is(":focus")) {
        sequenceConfiguration.timeBetweenSteps = calculateStepDelayFromTempo();
    }
    
    if(sequenceConfiguration.beatNumber >= sequenceConfiguration.totalNumberOfBeats) { 
        sequenceConfiguration.beatNumber = 0;
    }
    setTimeout( 
        (tempoStep).bind(undefined, SelectedSounds.find(), sequenceConfiguration) 
        , sequenceConfiguration.timeBetweenSteps
    );
}

// Plays the sound associated with a given track
playSound = function(selectedSoundId, path) {
    var finishedLoading = function(bufferList){
        var source = audioCtx.createBufferSource(); // creates a sound source
        //var source = audioSources[selectedSoundId].source;
        source.buffer = bufferList[0];                    // tell the source which sound to play
        source.connect(audioSources[selectedSoundId].gainNode);       // connect the source to the context's destination (the speakers)
        source.start(0); 
    }
    var bufferLoader = new BufferLoader(
        audioCtx,
        [
          path
        ],
        finishedLoading
        );
    bufferLoader.load();
}

updateSoundVolume = function(selectedSoundId, newVolume){
    audioSources[selectedSoundId].gainNode.gain.value = newVolume/10;
}

updateSoundPan = function(selectedSoundId, newPan){
    audioSources[selectedSoundId].panNode.pan.value = newPan/10;
}

// Helpers to be moved to a new file:
audioTagFor = function(selectedSoundId) {
    return $('#audio-' + selectedSoundId);
};

// Checks if solo mode should be turned off (none of the tracks are soloed)
updateSoloMode = function(){
    var soundsSoloed = SelectedSounds.find({'soloed' : true}).count();
    if(soundsSoloed == 0) {
        inSoloMode = false;
        inSoloModeTracker.changed();
    }
};

// Checks if solo mode should be turned off (none of the tracks are soloed)
unsoloAll = function(){
    SelectedSounds.find({'soloed' : true}).forEach(function(sound){
        SelectedSounds.update({_id: sound._id} ,  {$set : {'soloed' : false}});
    });
};


function BufferLoader(context, urlList, callback) {
  this.context = context;
  this.urlList = urlList;
  this.onload = callback;
  this.bufferList = new Array();
  this.loadCount = 0;
}

BufferLoader.prototype.loadBuffer = function(url, index) {
  // Load buffer asynchronously
  var request = new XMLHttpRequest();
  request.open("GET", url, true);
  request.responseType = "arraybuffer";

  var loader = this;

  request.onload = function() {
    // Asynchronously decode the audio file data in request.response
    loader.context.decodeAudioData(
      request.response,
      function(buffer) {
        if (!buffer) {
          alert('error decoding file data: ' + url);
          return;
        }
        loader.bufferList[index] = buffer;
        if (++loader.loadCount == loader.urlList.length)
          loader.onload(loader.bufferList);
      },
      function(error) {
        console.error('decodeAudioData error', error);
      }
    );
  }

  request.onerror = function() {
    alert('BufferLoader: XHR error');
  }

  request.send();
}

BufferLoader.prototype.load = function() {
  for (var i = 0; i < this.urlList.length; ++i)
  this.loadBuffer(this.urlList[i], i);
}
