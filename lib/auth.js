var jwt = require('express-jwt');
var settingsService = require('./settings_service');

module.exports = {

  authenticate: jwt({
    secret: new Buffer(process.env.AUTH0_CLIENT_SECRET, 'base64'),
    audience: process.env.AUTH0_CLIENT_ID
  }),

  isAdmin: function(user) {
    if (user && user.sub) {
      var user_id = user.sub;

      // Check for environment declared admins
      if (process.env.ADMIN_USERS.split(',').indexOf(user_id) > -1) {
        return true;
      }

      // Check for RBAC admins
      // if (req.user && req.user.roles && req.user.roles.indexOf('Admins') > -1) {
      //   next();
      // }
    }

    return false;
  },

  authenticateAdmin: function(req, res, next) {
    if (!this.isAdmin(req.user)) {
      throw { status: 403, code: 'unathorized_api_call', message: 'Unauthorized to access this resource.'};
    }
  }
};
