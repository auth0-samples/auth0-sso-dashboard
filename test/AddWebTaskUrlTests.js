var harness = require('./RuleTestHarness');
var assert  = require('assert');
var path = require('path');

var rulePath = path.join(__dirname, '../rules/AddWebTaskTokens.js');

describe('AddWebTestTokens', function() {
  it('should return token for non-admins', function(cb) {

    var user = {
      user_id: 'test|12345'

    };
    var context = {
      client_id: process.env.AUTH0_CLIENT_ID
    };

    harness(rulePath, user, context, function(err, user, context) {
      if (err) throw err;
      assert(user.task_tokens.get_user_clients);
      //console.log(user.client_apps_token);
      cb();
    });
  });

  it('should return tokens for admins', function(cb) {

    var user = {
      user_id: 'test|12345',
      groups: ['SSO Dashboard Admins']
    };
    var context = {
      client_id: process.env.AUTH0_CLIENT_ID
    };

    harness(rulePath, user, context, function(err, user, context) {
      if (err) throw err;
      assert(user.task_tokens.get_user_clients);
      assert(user.task_tokens.auth0_proxy);
      console.log(user.task_tokens.auth0_proxy);
      cb();
    });
  });
})
