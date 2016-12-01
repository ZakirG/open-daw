import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';


 // Load a few sound presets for the user.
SelectedSounds = new Mongo.Collection(null);
if(SelectedSounds.find().count() == 0) { 
    SelectedSounds.insert({ 'path' : '/sounds/basicClap.wav', 'type' : 'presetSound', 'name' : 'Basic Clap'});
    SelectedSounds.insert({ 'path' : '/sounds/basicHiHat.wav', 'type' : 'presetSound', 'name' : 'Basic HiHat'});
    SelectedSounds.insert({ 'path' : '/sounds/strongKick.wav', 'type' : 'presetSound', 'name' : 'Strong Kick'});
    SelectedSounds.insert({ 'path' : '/sounds/strongTom.wav', 'type' : 'presetSound', 'name' : 'Strong Tom'});
}