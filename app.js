require('babel/register');
require('dotenv').load();
var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');

var app = express();

app.use(bodyParser.json());
app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));

require('./lib/routes')(app);
require('./lib/errors')(app);

module.exports = app;
