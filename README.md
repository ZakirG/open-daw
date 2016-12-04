# MeteorDAW

##### A mobile-friendly music sequencing web app written in MeteorJS. 

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
- basic sequencer functionality: program rhythms at custom tempos
- responsive initial page layout -- header, footer, control bar, tracks, sequencer
- track controls: mute, volume knob, sequencer steps, sound selection
- master controls: play, pause, add new tracks, adjust tempo

###### Upcoming features:
- more precise timing of sample playback
- allow for tempo changes during playback
- master volume control
- sequences can be bounced & exported to wav files

###### Stretch goals:
- sequences can be bounced & exported to mp3 files
- panning knobs on individual tracks
- ability to choose how finely measures are subdivided
- allow for user-uploaded sounds for sequencing
- allow for user-uploaded audio tracks
- users can select from premade sequences
- users can export their sequences as metadata text files bundled with audio files
- users can reimport these text files to reobtain the sequencer's state

###### Desktop screenshot:
<img src="./public/screenshots/desktopScreenshot.png" alt="App Screenshot on Desktop" width="350"/>

###### Mobile screenshot:
<img src="./public/screenshots/mobileScreenshot.png" alt="App Screenshot on Mobile" width="200"/>

Project started 11/29/2016.

Thank you to https://github.com/eskimoblood/jim-knopf for their knob control library, used in this application.

