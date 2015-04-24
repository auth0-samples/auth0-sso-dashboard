var auth = require('./auth');
var auth0Service = require('./auth0_service');
var dataService = require('./data_service');

module.exports = function(app) {

  app.use('/api', auth.authenticate);

  app.get('/api/userapps', function(req, res) {

    auth0Service.getAppsForUser(req.user.sub).then(apps => {
      res.json(apps);
    }).catch(err => {
      console.log(err);
      res.sendStatus(500);
    });
  });

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
    dataService.saveClient(req.body).then((client) => {
      res.json(client);
    }).catch(err => {
      console.log(err);
      res.sendStatus(500);
    });
  });

  app.get('/api/roles', function(req, res) {
    dataService.getRoles()
    .then((roles) => {
      res.json({ roles: roles });
    }).catch(err => {
      console.log(err);
      res.sendStatus(500);
    });
  });

  app.post('/api/roles', function(req, res) {
    dataService.saveRole(req.body).then((role) => {
      res.json(role);
    });
  });

  app.delete('/api/roles/:id', function(req, res) {
    dataService.deleteRole(req.params.id).then(() => {
      res.sendStatus(200);
    }).catch((err) => {
      console.log(err);
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
  });

  app.patch('/api/users/:id', function(req, res) {
    auth0Service.saveUser(req.params.id, req.body).then((user) => {
      res.json(user);
    }).catch(err => {
      console.log(err);
      res.sendStatus(500);
    });
  });

};
