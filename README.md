# MeteorDAW

##### A mobile-friendly music sequencing web app written in MeteorJS. 

###### Screenshots (desktop & mobile):
<img src="./public/screenshots/desktopScreenshot.png" alt="App Screenshot on Desktop" width="550"/> <img src="./public/screenshots/mobileScreenshot.png" alt="App Screenshot on Mobile" width="200"/>

###### Build instructions:
Install <a href="https://www.meteor.com/">Meteor</a> and then run
```
git clone https://github.com/ZakirG/meteor-daw.git
cd meteor-daw/
meteor
```
You may be prompted to install additional packages. 
Once the app is running, navigate to http://localhost:3000/ in your browser.

###### Features:
- basic sequencer functionality: program rhythms at a range of tempos with sound presets
- track controls: mute, volume knob, sequencer steps, sound selection
- master controls: play, pause, add new tracks, adjust tempo
- responsive layout -- header, footer, control bar, tracks, sequencer

###### Upcoming features:
- allow for tempo changes during playback
- master volume control
- sequences can be bounced & exported to wav files

###### Possible feature goals for a v2.0:
- sequences can be bounced & exported to mp3 files
- panning knobs on individual tracks
- allow for user-uploaded sounds for sequencing
- allow for user-uploaded audio tracks
- ability to download sequencer state as a text file of human-readable metadata


Project started 11/29/2016.

Thank you to https://github.com/eskimoblood/jim-knopf for their knob control library, used in this application.

