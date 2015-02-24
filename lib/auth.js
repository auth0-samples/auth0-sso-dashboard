var jwt = require('express-jwt');
var nconf = require('nconf');

module.exports.authenticate = jwt({
  secret: new Buffer(nconf.get('auth0_client_secret'), 'base64'),
  audience: nconf.get('auth0_client_id')
});

module.exports.authenticateAdmin = function(req, res, next) {
  if (req.user && req.user.roles && req.user.roles.indexOf('admin') > -1) {
    next();
  }
  throw { status: 403, code: 'unathorized_api_call', message: 'Unauthorized to access this resource.'};
};
