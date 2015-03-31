var fs = require('fs');
var path = require('path');
var auth = require('./auth');
var request = require('request');
var util = require('util');
var auth0Service = require('./auth0_service');
var settingsService = require('./settings_service');
var _ = require('lodash');
var less = require('less');


module.exports = function(app) {

  var mapRouteToIndex = function(route) {

    app.get(route, function(req, res, next) {
      settingsService.getSettings()
      .then(config => {
        config.auth0_domain = process.env.AUTH0_DOMAIN;
        config.auth0_client_id = process.env.AUTH0_CLIENT_ID;
        config.auth0_connection = process.env.AUTH0_CONNECTION;
        res.render('index', {
          title: config.title,
          theme_color: config.theme_color,
          config: JSON.stringify(config)
        });
      }).catch(err => {
        console.log(err);
        res.sendStatus(500);
      });

    });
  };

  ['/', '/login', '/admin', '/admin/users', '/admin/settings', '/admin/apps', '/admin/roles', '/profile'].map(mapRouteToIndex);

  app.get('/style/theme', function(req, res) {
    settingsService.getSettings()
    .then(config => {
      var styles = `
        @theme_color: ${config.theme_color};
        @import "theme";
      `;
      return new Promise((resolve, reject) => {
        less.render(styles,
          {
            paths: ['./app/styles/'],
            filename: 'theme.less',
            compress: true
          },
          function (err, output) {
            if (err) {
              reject(err);
            } else {
              resolve(output);
            }
          });
      });
    }).then(output => {
      res.set('Content-Type', 'text/css');
      res.send(output.css);
    }).catch(err => {
      console.log(err);
      res.sendStatus(500);
    })
  })

  // Non-Admin APIs
  /////////////////////////////////////////////////////////////////

  app.use('/api', auth.authenticate);

  app.get('/api/user/apps', function(req, res) {

    auth0Service.getAppsForUser(req.user.sub).then(apps => {
      res.json(apps);
    }).catch(err => {
      console.log(err);
      res.sendStatus(500);
    });
  });

  app.get('/api/userprofile', function(req, res) {
    auth0Service.getUserProfile(req.user.sub).then(profile => {
      profile.is_admin = auth.isAdmin(req.user);
      res.json(profile);
    }).catch(err => {
      console.log(err);
      res.sendStatus(500);
    });
  });

  app.patch('/api/userprofile', function(req, res) {
    auth0Service.saveUserProfile(req.user.sub, req.body).then((profile) => {
      res.json(profile);
    }).catch(err => {
      console.log(err);
      res.sendStatus(500);
    });
  });

  // Admin Only APIs
  /////////////////////////////////////////////////////////////////

  app.use('/api', auth.authenticateAdmin);

  app.get('/api/apps', function(req, res) {
    auth0Service.getApps().then(apps => {
      res.json(apps);
    }).catch(err => {
      console.log(err);
      res.sendStatus(500);
    });
  });

  app.post('/api/apps', function(req, res) {
    settingsService.saveClient(req.body).then((client) => {
      res.json(client);
    }).catch(err => {
      console.log(err);
      res.sendStatus(500);
    });
  });

  app.get('/api/roles', function(req, res) {
    settingsService.getRoles()
    .then((roles) => {
      res.json({ roles: roles });
    }).catch(err => {
      console.log(err);
      res.sendStatus(500);
    });
  });

  app.post('/api/roles', function(req, res) {
    settingsService.saveRole(req.body).then((role) => {
      res.json(role);
    });
  });

  app.delete('/api/roles/:id', function(req, res) {
    settingsService.deleteRole(req.params.id).then(() => {
      res.sendStatus(200);
    }).catch((err) => {
      console.log(err)
      res.sendStatus(404);
    });
  });

  app.get('/api/users', function(req, res) {
    auth0Service.getUsers(req.params).then(users => {
      res.json(users);
    }).catch(err => {
      console.log(err);
      res.sendStatus(500);
    });
  })

  app.patch('/api/users/:id', function(req, res) {
    auth0Service.saveUser(req.params.id, req.body).then((user) => {
      res.json(user);
    }).catch(err => {
      console.log(err);
      res.sendStatus(500);
    });
  });

  app.patch('/api/settings', function(req, res) {
    settingsService.saveSettings(req.body)
    .then(settings => {
      res.json(settings);
    }).catch(err => {
      console.log(err);
      res.sendStatus(500);
    });
  })
};
