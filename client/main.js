import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';

Meteor.subscribe('allSounds');

Template.layout.events({
    'click #add-track' : function() {
        // When a user creates a new track, the kick will be the default sound.
        SelectedSounds.insert(strongKick);
    } 
});