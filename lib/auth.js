var jwt = require('express-jwt');
var settingsService = require('./settings_service');

module.exports.authenticate = jwt({
  secret: new Buffer(process.env.AUTH0_CLIENT_SECRET, 'base64'),
  audience: process.env.AUTH0_CLIENT_ID
});


module.exports.authenticateAdmin = function(req, res, next) {
  if (req.user && req.user.roles && req.user.roles.indexOf('admin') > -1) {
    next();
  }
  throw { status: 403, code: 'unathorized_api_call', message: 'Unauthorized to access this resource.'};
};
