# MeteorDAW

#### A mobile-friendly music sequencing web app written in MeteorJS. 

##### Screenshots:
<img src="./public/screenshots/desktopScreenshot.png" alt="App Screenshot on Desktop" width="550"/> <img src="./public/screenshots/mobileScreenshot.png" alt="App Screenshot on Mobile" width="200"/>

##### Features (version 0.1):
- Sequencer functionality: program rhythms w/ presets and user-uploaded sounds
- Sequences can be bounced and exported to .wav files
- Responsive layout, works well on iPhone 6 (375px width)

##### Build instructions:
Install <a href="https://www.meteor.com/" target="_blank">Meteor</a> and then run
```
git clone https://github.com/ZakirG/meteor-daw.git
cd meteor-daw/
meteor
```
You may be prompted to install additional packages. 
Once the app is running, navigate to http://localhost:3000/ in your browser.

##### Upcoming features for version 0.1:
- A dynamic grid to allow sequencing with eighth, 16th, and 32nd notes
- Sequence presets

##### Feature goals for version 0.2:
- A midi-compatible piano roll
- Allow for user-uploaded audio tracks with preview waveforms
- VST-like track effects with the Web Audio API and <a href="http://sox.sourceforge.net/Docs/FAQ" target="_blank">SoX</a>
- An undo button, a redo button, an undo history with human-readable action descriptions
- Keyboard shortcuts

Project started 11/29/2016.

Thank you to <a href="https://github.com/eskimoblood/jim-knopf" target="_blank">eskimoblood</a> for their knob control library, used in this application.

Thank you to <a href="https://github.com/cwilso/" target="_blank">cwilso</a> for inspiration on using Web Workers for <a href="https://github.com/cwilso/MIDIDrums/">note scheduling functionality in a drum sequencer.</a> 

Thank you to <a href="https://github.com/mattdiamond/" target="_blank">mattdiamond</a> for their <a href="https://github.com/mattdiamond/Recorderjs">RecorderJS library</a>, without which bounce functionality would not have been possible.