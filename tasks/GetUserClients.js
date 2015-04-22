var request = require('request');
var AWS = require('aws-sdk');
var _ = require('lodash');
var Q = require('q');
var util = require('util');

return function(context, cb) {
  const samlAddons = ['samlp', 'salesforce_api', 'salesforce_sandbox_api', 'salesforce', 'box', 'concur']
  const wsFedAddons = ['wsfed', 'sharepoint'];

  var data = context.data;

  var s3 = new AWS.S3({ params: { Bucket: data.aws_bucket }});
  s3.config.credentials = new AWS.Credentials(
    data.aws_access_key_id,
    data.aws_secret_access_key
  );

  var getAuthProtocol = (app) => {
    if (app.addons) {
      for (var addon in app.addons) {
        if (samlAddons.indexOf(addon) > -1) {
          return 'samlp';
        } else if (wsFedAddons.indexOf(addon) > -1) {
          return 'ws-fed';
        }
      }
    }

    return 'openid-connect';
  }

  var cleanApp = (app) => {
    var authProtocol = getAuthProtocol(app);
    switch (authProtocol) {
      case 'samlp':
        app.login_url = util.format(
          'https://%s/samlp/%s?connection=%s',
          data.auth0_domain,
          app.client_id,
          data.auth0_connection);
        break;
      case 'ws-fed':
        var callback = '';
        if (app.callbacks && app.callbacks.length > 1) {
          callback = app.callbacks[1];
        }
        app.login_url = util.format(
          'https://%s/wsfed/%s?whr=%s&wreply=%s',
          data.auth0_domain,
          app.client_id,
          data.auth0_connection,
          callback);
        break;
      case 'openid-connect':
        var callback = '';
        if (app.callbacks && app.callbacks.length > 0) {
          callback = app.callbacks[0];
        }
        app.login_url = util.format(
          'https://%s/authorize?response_type=code&scope=openid&client_id=%s&redirect_uri=%s&connection=%s',
          data.auth0_domain,
          app.client_id,
          callback, // Select the first callback url, this isn't really ideal though
          data.auth0_connection)
        break;
      default:
        throw 'unknown auth protocol';
    }
    delete app.addons;
    delete app.callbacks

    app.logo_url = app.logo_url || '/img/default.png';
    return app;
  }

  var getRoles = () => {
    return Q.Promise((resolve, reject) => {
      var params = {
        Key: 'data/roles.json'
      }
      s3.getObject(params, function(err, response) {
        if (err) {
          reject(err);
        }
        else {
          var data = JSON.parse(response.Body.toString());
          resolve(data.result);
        }
      })
    });
  }

  var getUser = (user_id) => {
    return Q.Promise((resolve, reject) => {
      request({
        url: 'https://' + data.auth0_domain + '/api/v2/users/' + user_id, // + '?fields=groups,app_metadata',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + data.auth0_api_key
        }
      }, function(error, response, body) {
        if (error || response.statusCode !== 200) {
          console.error('HTTP Status: ' + response.statusCode);
          if (error) {
            reject(error);
          }
          reject('Invalid HTTP request. Status code: ' + response.statusCode);
        } else {
          var user = JSON.parse(body);
          resolve(user);
        }
      });
    });
  }

  var getUserRoles = (user) => {
    return Q(all_roles).then(roles => {
      var user_roles = [];
      if (user.groups && user.groups.length > 0) {
        user.groups.map(function(group) {
          var role = _.find(roles, function(role) {
            return role.groups && (role.groups.indexOf(group) > -1);
          });
          if (role) {
            user_roles.push(role.id);
          }
        });
      }
      if (user.app_metadata && user.app_metadata.roles && user.app_metadata.roles.length > 0) {
        user.app_metadata.roles.map(function(role_id) {
          user_roles.push(role_id)
        });
      }
      return user_roles;
    });
  }

  var requestApps = () => {
    return Q.Promise((resolve, reject) => {
      request({
        url: 'https://' + data.auth0_domain + '/api/v2/clients?fields=name,client_id,addons,global,callbacks',
        headers: {
          'Authorization': 'Bearer ' + data.auth0_api_key
        }
      }, function(error, response, body) {
        if (error || response.statusCode !== 200) {
          if (error) {
            console.error(error);
            reject(error);
          }
          reject('Invalid HTTP request. Status code: ' + response.statusCode);
        } else {
          var apps = [];
          var data = JSON.parse(body);
          var params = {
            Key: 'data/clients.json'
          }
          s3.getObject(params, (err, response) => {
            if (err) reject(err);
            var metadatas = JSON.parse(response.Body.toString()).result;

            for (var i = 0; i < data.length; i++) {
              var app = data[i];
              var metadata = _.find(metadatas, { client_id: app.client_id });
              if (metadata) {
                app = _.merge(app, metadata);
              }
              apps.push(app);
            }
            resolve(apps);
          });
        }
      });
    });
  }

  var getApps = (securityTrim) => {
    securityTrim = securityTrim || function(apps) { return Q(apps); }

    return requestApps()
    .then(apps => {
      var p = [];
      for (var i = 0; i < apps.length; i++) {
        var app = apps[i];
        // Filter out this app and the global 'all applications' app
        if (data.auth0_client_id !== app.client_id && app.global === false) {
          // App is allowed, now check permissions
          p.push(cleanApp(app));
        }
      }
      return Q.all(p);
    })
    .then(securityTrim)
    .then(apps => {
      return apps;
    });
  }

  var getUserApps = (user_role_ids) => {
    return Q(all_roles).then(roles => {
      var perms = {
        all_allowed: false,
        apps: []
      };
      user_role_ids.map(function(id) {
        var role = _.find(roles, { id: id });
        if (role) {
          perms.all_apps = perms.all_apps || role.all_apps;
          perms.apps = _.union(perms.apps, role.apps);
        }
      });
      return perms;
    }).then(perms => {
      var securityTrim = function(apps) {
        return Q.Promise((resolve, reject) => {
          if (perms.all_apps) {
            return resolve(apps);
          } else {
            var allowed_apps = [];
            apps.map(function(app) {
              if (perms.apps.indexOf(app.client_id) > -1) {
                allowed_apps.push(app);
              }
            })
            return resolve(allowed_apps);
          }
        });
      }
      return getApps(securityTrim);
    });
  }

  var user_id = context.data.user_id;

  var all_roles;

  return getRoles()
    .then((roles) => { all_roles = roles; })
    .then(() => { return user_id })
    .then(getUser)
    .then(getUserRoles)
    .then(getUserApps)
    .then(apps => {
      cb(null, apps);
    })
    .fail(err => {
      cb(err);
    })
    .done();

}
