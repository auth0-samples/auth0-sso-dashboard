var Dispatcher = require('../Dispatcher');
var Constants = require('../Constants');
var API = require('../API');

module.exports = {

  loadSettings: function(settings) {
    Dispatcher.dispatch({
      actionType: Constants.SETTINGS_SAVED,
      settings: settings
    });
  },

  saveSettings: function(token, settings) {
    API.saveSettings(token, settings);
  }

};
