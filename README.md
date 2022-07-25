# OpenDAW

#### A mobile-friendly drum machine written in MeteorJS. 

##### Screenshots:
<img src="./public/screenshots/desktopScreenshot.png" alt="App Screenshot on Desktop" width="550"/> <img src="./public/screenshots/mobileScreenshot.png" alt="App Screenshot on Mobile" width="200"/>

##### Features (version 0.1):
- Sequencer functionality: program rhythms with presets and user-uploaded sounds
- Stereo panning controls, solo-mode toggle, mid-playback tempo adjustability
- Bounce and export your sequences to .wav files
- Responsive layout, works well on iPhone 6 (375px width)

##### Build instructions:
Install <a href="https://www.meteor.com/" target="_blank">Meteor</a> and then run
```
git clone https://github.com/ZakirG/open-daw.git
cd open-daw/
meteor
```
You may be prompted to install additional packages. 
Once the app is running, navigate to http://localhost:3000/ in your browser.

Project started 11/29/2016.

Thank you to <a href="https://github.com/eskimoblood/jim-knopf" target="_blank">eskimoblood</a> for their knob control library, used in this application.

Thank you to <a href="https://github.com/cwilso/" target="_blank">cwilso</a> for inspiration on using Web Workers for <a href="https://github.com/cwilso/MIDIDrums/">note scheduling functionality in a drum sequencer.</a> 

Thank you to <a href="https://github.com/mattdiamond/" target="_blank">mattdiamond</a> for their <a href="https://github.com/mattdiamond/Recorderjs">RecorderJS library</a>, without which bounce functionality would not have been possible.
