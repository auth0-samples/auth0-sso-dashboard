

module.exports = (function() {
  var settingsService;
  if (process.env.SETTINGS_SERVICE) {
    return require('./' + process.env.SETTINGS_PROVIDER);
  } else {
    return require('./settings_file_service');
  }
})();
