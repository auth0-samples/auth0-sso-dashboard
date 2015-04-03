function(user, context, cb) {

  var config = configuration || process.env;

  if (context.clientID !== '{{auth0_client_id}}') {
    return cb(null, user, context);
  }

  user.is_admin = user.groups && user.groups.indexOf('{{admin_group}}') > -1;

  var camelToSnake = function(str) {
    return str.replace(/\W+/g, '_')
              .replace(/([a-z\d])([A-Z])/g, '$1_$2').toLowerCase();
  };

  var authCheck = function(taskName) {
    switch (taskName) {
      case 'GetUserClients':
        // These can be called by all authenticated users
        return true;
      default:
        // Everything else is for admins only
        return user.is_admin;
    }

  };


  var generateToken = function(taskName, callback) {
    var isAuthorized = authCheck(taskName);
    if (!isAuthorized) {
      return callback();
    }

    var webtaskUrl = "https://sandbox.it.auth0.com/api/tokens/issue";
    var url = 'https://s3-{{aws_region}}.amazonaws.com/{{aws_s3_bucket}}/tasks/' + taskName + '.js';
    var data = {
      pctx: {
        user_id: user.user_id,
        auth0_domain: '{{auth0_domain}}'
      },
      ectx: {
        auth0_api_key: config.SSO_DASHBOARD_AUTH0_API_KEY,
      },
      ten: 'auth0-sso-dashboard',
      url: url
    };

    request({
      url: webtaskUrl,
      method: 'POST',
      json: data,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + config.SSO_DASHBOARD_WEBTASK_API_KEY
      }
    }, function(error, response, body) {
      var result = { name: camelToSnake(taskName), token: body };
      callback(error, result);
    });
  };

  var tasks = ['GetUserClients', 'Auth0Proxy'];

  async.map(tasks, generateToken, function(err, tokens) {
    if (err) {
      cb(err);
    } else {
      user.task_tokens = {};
      tokens.map(function(obj) {
        if (obj) {
          user.task_tokens[obj.name] = obj.token;
        }
      });
      cb(null, user, context);
    }
  });
}
