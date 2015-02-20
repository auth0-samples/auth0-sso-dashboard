var proxy = require('json-proxy');
var fs = require('fs');
var path = require('path');
var authenticate = require('./auth').authenticate;
var authenticateAdmin = require('./auth').authenticateAdmin;

module.exports = function(app) {

  /* GET home page. */
  app.get('/', function(req, res, next) {
    var config = {
      auth0_client_id: process.env.AUTH0_CLIENT_ID,
      auth0_domain: process.env.AUTH0_DOMAIN
    };
    res.render('index', {
      config: JSON.stringify(config)
    });
  });

  // All requests to the API require authentication
  app.use('/api', authenticate);
  app.use('/api', authenticateAdmin);

  app.use(proxy.initialize({
    proxy: {
      forward: {
        '/api/(.*)': 'https://' + process.env.AUTH0_DOMAIN + '/api/v2/$1'
      },
      headers: {
        'Authorization': 'Bearer ' + process.env.AUTH0_API_TOKEN
      }
    }
  }));

  var addDataRoute = function(name) {
    var filePath = path.join(__dirname, '../data/' + name + '.json');
    var urlPath = '/data/' + name;
    app.use(urlPath, authenticate);
    app.get(urlPath, function(req, res) {
      fs.readFile(filePath, function(err, data) {
        res.set('Content-Type', 'application/json');
        res.send(data);
      })
    });

    app.use(urlPath, authenticateAdmin);
    app.post(urlPath, function(req, res) {
      fs.writeFile(filePath, res.body, function() {
        res.status(200);
        res.send();
      })
    });
  };

  addDataRoute('settings');
  addDataRoute('roles');

};
