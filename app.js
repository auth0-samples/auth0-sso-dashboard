var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var jwt = require('express-jwt');
var proxy = require('json-proxy');

var dotenv = require('dotenv');
dotenv.load();

var authenticate = jwt({
  secret: new Buffer(process.env.AUTH0_CLIENT_SECRET, 'base64'),
  audience: process.env.AUTH0_CLIENT_ID
});

var app = express();

//app.use(express.bodyParser());
//app.use(express.urlencoded());
//app.use(express.json());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'build')));

/* GET home page. */
app.get('/', function(req, res, next) {
  res.render('index', {
    auth0_client_id: process.env.AUTH0_CLIENT_ID,
    auth0_domain: process.env.AUTH0_DOMAIN
  });
});

// All requests to the API require authentication
app.use('/api', authenticate);
app.use('/api', function(req, res, next) {
  if (req.user && req.user.roles && req.user.roles.indexOf('admin') > -1) {
    next();
  }
  throw { status: 403, code: 'unathorized_api_call', message: 'Unauthorized to access this resource.'};
});
/*
app.use('/api', function(req, res, next) {
  // This is where we could check allowed actions
  next();
});
*/
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

// catch 404 and forward to error handler
app.use(function(req, res, next) {
var err = new Error('Not Found');
err.status = 404;
next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    var data = {
      message: err.message,
      error: err
    };
    handleError(data, req, res);
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  var data = {
    message: err.message,
    error: {}
  };
  handleError(data, req, res);
});

var handleError = function(err, req, res) {
  if (req.path.indexOf('/api') == 0) {
    res.json(err);
  } else {
    res.render('error', err);
  }
}

module.exports = app;
