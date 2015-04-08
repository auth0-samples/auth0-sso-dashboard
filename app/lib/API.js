var request = require('browser-request');
var Dispatcher = require('./Dispatcher');
var Constants = require('./Constants');
var qs = require('querystring');
var ProfileStore = require('./stores/ProfileStore');
var _ = require('lodash');
var uuid = require('uuid');

var sbUrlBase = 'https://sandbox.it.auth0.com/api/run/auth0-sso-dashboard';

module.exports = {

  _makeRequest: function(method, token, url, json, callback) {
    var options = {
      method: method,
      url: url,
      headers: {}
    }
    if (token) {
      options.headers['Authorization'] = 'Bearer ' + token
    }
    if (json && url.indexOf('sandbox.it.auth0.com') < 0) {
      options.json = json;
    } else {
      options.body = JSON.stringify(json);
    }

    request(options, function(error, response, body) {
      if (error || response.statusCode !== 200) {
        if (response.statusCode === 401) {
          Dispatcher.dispatch({
            actionType: Constants.USER_LOGGED_OUT
          });
        }
        console.log({ message: 'Error making HTTP Request', error: error, statusCode: response.statusCode });
        return;
      } else {
        var data;
        if (typeof body === "string") {
          data = JSON.parse(body)
        } else {
          data = body;
        }
        callback(data);
      }
    });
  },

  _get: function(token, url, callback) {
    this._makeRequest('GET', token, url, null, callback);
  },

  _post: function(token, url, json, callback) {
    this._makeRequest('POST', token, url, json, callback);
  },

  _patch: function(token, url, json, callback) {
    this._makeRequest('PATCH', token, url, json, callback);
  },

  _delete: function(token, url, callback) {
    this._makeRequest('DELETE', token, url, null, callback);
  },

  _getTaskUrl: function(query) {
    if (window.config.debug) {
      query = query || {};
      query.webtask_no_cache = 1
    }
    if (query) {
      return sbUrlBase + '?' + qs.stringify(query);
    } else {
      return sbUrlBase;
    }
  },

  _proxyUrl: function(path, query) {
    var args = {};
    args.path = path;
    if (query) {
      args.query = JSON.stringify(query);
    }
    return this._getTaskUrl(args);
  },

  _getS3: function(aws_credentials) {
    var s3 = new AWS.S3({ params: { Bucket: window.config.aws_s3_bucket }});
    s3.config.credentials = new AWS.Credentials(
      aws_credentials.AccessKeyId,
      aws_credentials.SecretAccessKey,
      aws_credentials.SessionToken);
    return s3;
  },

  loadUserApps: function(task_token) {
    var url = this._getTaskUrl();
    this._get(task_token, url, function(data) {
      Dispatcher.dispatch({
        actionType: Constants.RECEIVED_USER_APPS,
        apps: data
      });
    });
  },

  loadApps: function(proxy_token) {
    var url = this._proxyUrl('/api/v2/clients', {"fields": "name,client_id,global"});
    this._get(proxy_token, url, function(data) {
      var apps = [];
      for (var i = 0; i < data.length; i++) {
        var app = data[i];
        // Filter out this app and the global 'all applications' app
        if (window.config.auth0_client_id !== app.client_id && app.global === false) {
          // App is allowed, now check permissions
          apps.push(app);
        }
      }
      Dispatcher.dispatch({
        actionType: Constants.RECEIVED_APPS,
        apps: apps
      });
    })
  },

  saveApp: function(proxy_token, app) {
    this._proxyUrl('/api/v2/clients');
    this._post(proxy_token, url, app, function(data) {
      Dispatcher.dispatch({
        actionType: Constants.SAVED_APP,
        app: data
      });
    })
  },

  loadRoles: function(aws_credentials) {
    var s3 = this._getS3(aws_credentials);
    var params = {
      Key: 'data/roles.json'
    }
    s3.getObject(params, function(err, response) {
      if (err) { throw err; }
      var data = JSON.parse(response.Body.toString());
      Dispatcher.dispatch({
        actionType: Constants.RECEIVED_ROLES,
        roles: data.result
      });
    });
  },

  saveRole: function(aws_credentials, role) {
    var s3 = this._getS3(aws_credentials);
    var params = {
      Key: 'data/roles.json'
    }
    s3.getObject(params, function(err, response) {
      if (err) throw err;
      var data = JSON.parse(response.Body.toString());
      if (role.id) {
        var index = _.findIndex(data.result, { id: role.id });
        if (index > -1) {
          data.result[index] = role;
        } else {
          throw 'Invalid role id provided.';
        }
      } else {
        role.id = uuid.v4()
        data.result.push(role);
      }

      params.Body = JSON.stringify(data);
      //params.ContentType = 'application/json';
      s3.putObject(params, function(err, response) {
        if (err) throw err;
        Dispatcher.dispatch({
          actionType: Constants.RECEIVED_ROLES,
          roles: data.result
        });
      });
    });
  },

  deleteRole: function(aws_credentials, role_id) {
    var s3 = this._getS3(aws_credentials);
    var params = {
      Key: 'data/roles.json'
    }
    s3.getObject(params, function(err, response) {
      if (err) throw err;
      var data = JSON.parse(response.Body.toString());
      var index = _.findIndex(data.result, { id: role_id });
      if (index > -1) {
        data.result.splice(index, 1);
      } else {
        throw 'Invalid role id provided.';
      }

      params.Body = JSON.stringify(data);
      //params.ContentType = 'application/json';
      s3.putObject(params, function(err) {
        if (err) throw err;
        Dispatcher.dispatch({
          actionType: Constants.RECEIVED_ROLES,
          roles: data.result
        });
      });
    });
  },

  loadUsers: function(id_token, options) {
    var url = this._proxyUrl('/api/v2/users', options)
    this._get(id_token, url, function(data) {
      Dispatcher.dispatch({
        actionType: Constants.RECEIVED_USERS,
        users: data
      });
    });
  },

  loadUserProfile: function(id_token) {
    var url = 'https://' + window.config.auth0_domain + '/tokeninfo';
    var data = {
      id_token: id_token
    };
    this._post(null, url, data, function(profile) {
      Dispatcher.dispatch({
        actionType: Constants.RECEIVED_PROFILE,
        profile: profile
      });
    });
  },

  saveUserProfile: function(proxy_token, user_id, profile) {
    var body = {
      user_metadata: profile
    }
    var url = this._proxyUrl('/api/userprofile');
    this._patch(proxy_token, url, body, function(data) {
      Dispatcher.dispatch({
        actionType: Constants.RECEIVED_PROFILE,
        profile: data
      })
    });
  },

  saveUserRoles: function(proxy_token, user_id, roles) {
    var body = {
      app_metadata: {
        roles: roles
      }
    }
    var url = this._proxyUrl('/api/v2/users/' + user_id);
    this._patch(proxy_token, url, body, function(data) {
      Dispatcher.dispatch({
        actionType: Constants.SAVED_USER,
        user: data
      });
    });
  },

  refreshToken: function(id_token) {

  },


};
