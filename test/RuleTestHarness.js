require('dotenv').load();
var fs = require('fs');

module.exports = function(rulePath, user, context, cb) {
  var request = require('request');
  var util = require('util');
  var async = require('async');
  // TODO: Load more modules

  var ruleText = fs.readFileSync(rulePath, 'utf8');
  ruleText = '(' + ruleText + ')(user, context, cb);';
  eval(ruleText);
}
