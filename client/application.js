sequenceIsPlaying = false;
playModeTracker = new Tracker.Dependency();

schedulingWorker = null;

timeState = [1, 0, 0, 0, 0, 0, 0, 0];
timeStateTracker = new Tracker.Dependency();

inSoloMode = false;
inSoloModeTracker = new Tracker.Dependency();

audioCtx = new (window.AudioContext || window.webkitAudioContext)();
masterSource = new MasterSource(audioCtx);
audioSources = {};

userSounds = {};

sequenceConfiguration = {
    beatNumber : 0, 
    totalNumberOfBeats : 8,
    timeBetweenSteps : null,
    totalNumberOfBeats : 8
}

var playTime = 0.0; // The next scheduled note will be played at this time 
var startTime = 0.0;
var jiggleFactor = 0.250; // Make this number bigger if there is a lag between notes being played

Template.application.onRendered(function(){    
   sequenceIsPlaying = false;
   SelectedSounds.find().forEach(function(sound){
        audioSources[sound._id] = new Source(audioCtx, audioTagFor(sound._id)[0], masterSource);  
    });
    sequenceConfiguration.timeBetweenSteps = calculateStepDelayFromTempo();
    
    var workerBlob = new Blob([
        "function tempoStep(){timeoutID=setTimeout(function(){postMessage('tempoStep'),tempoStep()},100)}var timeoutID=0;onmessage=function(a){'start'==a.data?timeoutID||tempoStep():'stop'==a.data&&(timeoutID&&clearTimeout(timeoutID),timeoutID=0)};"
        ])
    schedulingWorker = new Worker(window.URL.createObjectURL(workerBlob));
});

Template.application.helpers({
    selectedSounds: function(){
        return SelectedSounds.find();
    }
});

calculateStepDelayFromTempo = function(){
     var bpm = $('#tempo').val();
    // We treat each sequence step as a 16th note
    var timeBetweenSteps = ((60 / bpm) * 1000) / 2; // in milliseconds
    return timeBetweenSteps;
}

// Plays the user-generated sequence
playSequence = function(upperLimit) {
    startTime = audioCtx.currentTime + 0.005;
    playTime = 0.0;
    sequenceConfiguration.beatNumber = -1;
    schedule(upperLimit);
    schedulingWorker.onmessage = function(e) {
        schedule(upperLimit);
    };
    schedulingWorker.postMessage("start");
}

pauseSequence = function() {
    schedulingWorker.postMessage("stop");
}

clearSequence = function(){
    SelectedSounds.find().forEach(function(track){
        SelectedSounds.update(track._id, {$set: {sequenceSteps: emptySequence()}});
    });
}

emptySequence = function(){
    return Array.apply(null, Array(sequenceConfiguration.totalNumberOfBeats)).map(Number.prototype.valueOf,0);
}

bounceSequence = function(){
    var dest = audioCtx.createMediaStreamDestination();
    var mediaRecorder = new Recorder(masterSource.gainNode) //new MediaRecorder(dest.stream);
    
    masterSource.gainNode.disconnect(audioCtx.destination);    
    var chunks = [];
    
    mediaRecorder.record();
    sequenceIsPlaying = true;
    playModeTracker.changed();
    playSequence(sequenceConfiguration.totalNumberOfBeats);
    window.setTimeout(function(){
        mediaRecorder.stop();
        mediaRecorder.exportWAV(function(blob) {
            var url = URL.createObjectURL(blob);
            $('#download-bounce').prop('href', URL.createObjectURL(blob));
            $('#download-bounce').removeClass('disabled');
        })
        masterSource.gainNode.connect(audioCtx.destination);
    }, sequenceConfiguration.totalNumberOfBeats * sequenceConfiguration.timeBetweenSteps);
}

// Advances one or more tempo steps; Schedules a number of sounds to be played ahead of time
var schedule = function(upperLimit) {
    timeState = emptySequence(); // array of 8 zeros for a default sequence;
    timeState[sequenceConfiguration.beatNumber] = 1;
    timeStateTracker.changed();
    var currentTime = audioCtx.currentTime;
    currentTime = currentTime - startTime;
    while(playTime < currentTime + jiggleFactor) {
        sequenceConfiguration.beatNumber++;
        if(upperLimit == null && sequenceConfiguration.beatNumber >= sequenceConfiguration.totalNumberOfBeats) { 
            sequenceConfiguration.beatNumber = 0;
        }
        else if (upperLimit != null && upperLimit == sequenceConfiguration.beatNumber) {
            sequenceIsPlaying = false;
            playModeTracker.changed();
            pauseSequence();
            return;
        }
        
        var relativePlayTime = playTime + startTime;
        SelectedSounds.find().forEach(function(track){
            if(track.sequenceSteps[sequenceConfiguration.beatNumber] && !trackIsDisabled(track)) {
                playSound(track._id, track.path, relativePlayTime);
            }
        });
    
        // If the user is not currently editing the tempo, update the tempo
        if(!$('#tempo').is(":focus")) {
            sequenceConfiguration.timeBetweenSteps = calculateStepDelayFromTempo();
        }
        
        playTime += sequenceConfiguration.timeBetweenSteps / 1000;
    }
}

// Plays the sound associated with a given track
playSound = function(selectedSoundId, path, delayTime) {
    if(delayTime == null) delayTime = 0;
    var finishedLoading = function(bufferList){
        var source = audioCtx.createBufferSource(); // creates a sound source
        //var source = audioSources[selectedSoundId].source;
        source.buffer = bufferList[0];                    // tell the source which sound to play
        source.connect(audioSources[selectedSoundId].gainNode);       // connect the source to the context's destination (the speakers)
        source.start(delayTime); 
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
