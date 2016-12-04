import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';

Meteor.subscribe('allSounds');

Template.controlFrame.events({
    'click #add-track' : function() {
        SelectedSounds.insert(strongKick); // When a user creates a new track, the kick will be the default sound.
    } 
});