

module.exports = (function() {
  var settingsService;
  if (process.env.SETTINGS_SERVICE) {
    var SettingsService = require('./' + process.env.SETTINGS_PROVIDER);
    return new SettingsService();
  } else {
    var SettingsFileService = require('./settings_file_service')
    return new SettingsFileService();
  }
})();
