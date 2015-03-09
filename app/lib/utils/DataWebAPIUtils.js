var request = require('browser-request');
var AppActionCreators = require('../actions/AppActionCreators');
var UserActionCreators = require('../actions/UserActionCreators');
var Dispatcher = require('../dispatcher/AppDispatcher');
var AppConstants = require('../constants/AppConstants');
var AuthActionCreators = require('../actions/AuthActionCreators');
var qs = require('querystring');

module.exports = {

  _get: function(token, url, options, callback) {
    if (options) {
      url + '?' + qs.stringify(options);
    }
    request({
      url: url,
      headers: {
        'Authorization': 'Bearer ' + token
      }
    }, function(error, response, body) {
      if (error || response.statusCode !== 200) {
        if (response.statusCode === 401) {
          AuthActionCreators.logout();
        }
        console.log({ message: 'Error making HTTP Request', error: error, statusCode: response.statusCode });
        return;
      } else {
        var data = JSON.parse(body);
        callback(data);
      }
    });
  },

  loadUserApps: function(token) {
    this._get(token, '/api/user/apps', null, AppActionCreators.receiveUserApps);
  },

  loadApps: function(token) {
    this._get(token, '/api/apps', null, AppActionCreators.recieveApps)
  },

  loadRoles: function(token) {
    this._get(token, '/api/roles', null, function(data) {
      Dispatcher.dispatch({
        actionType: AppConstants.RECEIVED_ROLES,
        roles: data.roles
      });
    });
  },

  saveRole: function(token, role, callback) {
    console.log('saving role');;
  },

  loadUsers: function(token, options) {
    this._get(token, '/api/proxy/users', options, UserActionCreators.receiveUsers);
  }
};
