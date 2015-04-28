var auth = require('./auth');
var auth0Service = require('./auth0_service');
var dataService = require('./data_service');
var jwt = require('jsonwebtoken');

module.exports = function(app) {

  app.get('/api/authorize', function(req, res, next) {
    var token = req.get('Authorization').substring('Bearer '.length);
    console.log(token)
    jwt.verify(token, process.env.AUTH0_CLIENT_SECRET, function(err, decoded) {
      if (err) {
        console.log(err);
        res.sendStatus(403);
      } else {
        console.log(decoded.sub)
        auth0Service.isAuthorized(decoded.sub, decoded.client_id).then(result => {
          if (result) {
            res.sendStatus(200);
          } else {
            res.sendStatus(403);
          }
        }).catch(next);
      }
    });
  });

  app.use('/api', auth.authenticate);

  app.get('/api/userapps', function(req, res, next) {
    auth0Service.getAppsForUser(req.user.sub).then(apps => {
      res.json(apps);
    }).catch(next);
  });

  app.use('/api', auth.authenticateAdmin);

  app.get('/api/apps', function(req, res, next) {
    auth0Service.getApps().then(apps => {
      res.json(apps);
    }).catch(next);
  });

  app.post('/api/apps', function(req, res, next) {
    dataService.saveClient(req.body).then((client) => {
      res.json(client);
    }).catch(next);
  });

  app.get('/api/roles', function(req, res, next) {
    dataService.getRoles()
    .then((roles) => {
      res.json({ roles: roles });
    }).catch(next);
  });

  app.post('/api/roles', function(req, res, next) {
    dataService.saveRole(req.body).then((role) => {
      res.json(role);
    }).catch(next);
  });

  app.delete('/api/roles/:id', function(req, res, next) {
    dataService.deleteRole(req.params.id).then(() => {
      res.sendStatus(200);
    }).catch(next);
  });

  app.get('/api/users', function(req, res, next) {
    auth0Service.getUsers(req.params).then(users => {
      res.json(users);
    }).catch(next);
  });

  app.patch('/api/users/:id', function(req, res, next) {
    auth0Service.saveUser(req.params.id, req.body).then((user) => {
      res.json(user);
    }).catch(next);
  });
};
