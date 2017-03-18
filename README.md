# MeteorDAW

#### A mobile-friendly music sequencing web app written in MeteorJS. 

##### Screenshots (desktop & mobile):
<img src="./public/screenshots/desktopScreenshot.png" alt="App Screenshot on Desktop" width="550"/> <img src="./public/screenshots/mobileScreenshot.png" alt="App Screenshot on Mobile" width="200"/>

##### Features:
- basic sequencer functionality: program rhythms at a range of tempos with sound presets
- track controls: mute, solo, volume knob, sequencer steps, sound selection
- master controls: play, pause, add new tracks, adjust tempo, master volume
- tempo can be changed during playback
- responsive layout, works well on iPhone 5 (320px)
- an extensible design with the help of the Web Audio API

##### Build instructions:
Install <a href="https://www.meteor.com/" target="_blank">Meteor</a> and then run
```
git clone https://github.com/ZakirG/meteor-daw.git
cd meteor-daw/
meteor
```
You may be prompted to install additional packages. 
Once the app is running, navigate to http://localhost:3000/ in your browser.

##### Upcoming features:
- track panning, and sequence export to wav
- allow for user-uploaded sounds for sequencing

##### Feature goals for v2.0:
- allow for user-uploaded audio tracks with preview waveforms
- ability to download/reupload sequencer state as a text file of human-readable metadata
- integration of <a href="http://sox.sourceforge.net/Docs/FAQ" target="_blank">SoX</a> for VST-like track effects
- an undo button, a redo button
- an undo history with human-readable action descriptions
- keyboard shortcuts

Project started 11/29/2016.

Thank you to <a href="https://github.com/eskimoblood/jim-knopf" target="_blank">eskimoblood</a> for their knob control library, used in this application.