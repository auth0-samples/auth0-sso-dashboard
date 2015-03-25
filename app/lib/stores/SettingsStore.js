var Dispatcher = require('../Dispatcher');
var Constants = require('../Constants');
var Store = require('./Store');

var SettingsStore = new Store({});

// Register callback to handle all updates
Dispatcher.register(function(action) {

  switch(action.actionType) {
    case Constants.SETTINGS_SAVED:
      SettingsStore.set(action.settings);
      break;
    default:
      // no op
  }
});

module.exports = SettingsStore;
