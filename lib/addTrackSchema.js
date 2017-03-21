var SelectedSoundsSchema = new SimpleSchema({
  "name": {
    type: String
  },
  "type": {
    type: String,
    defaultValue: "presetSound"
  },
  "path": {
    type: String
  }
});

//SelectedSounds.attachSchema( SelectedSoundsSchema );