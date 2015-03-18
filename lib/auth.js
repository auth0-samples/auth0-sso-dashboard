var jwt = require('express-jwt');
var settingsService = require('./settings_service');

module.exports.authenticate = function(req, res, next) {
  settingsService.getConfigs('auth0_client_secret', 'auth0_client_id')
  .then(config => {
    var auth = jwt({
      secret: new Buffer(config.auth0_client_secret, 'base64'),
      audience: config.auth0_client_id
    });
    auth(req, res, next);
  });
}


module.exports.authenticateAdmin = function(req, res, next) {
  if (req.user && req.user.roles && req.user.roles.indexOf('admin') > -1) {
    next();
  }
  throw { status: 403, code: 'unathorized_api_call', message: 'Unauthorized to access this resource.'};
};
