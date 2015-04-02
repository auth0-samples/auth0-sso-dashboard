function(user, context, cb) {

  if (context.client_id !== process.env.AUTH0_CLIENT_ID) {
    return cb(null, user, context);
  }

  var camelToSnake = function(str) {
    return str.replace(/\W+/g, '_')
              .replace(/([a-z\d])([A-Z])/g, '$1_$2').toLowerCase();
  }

  var authCheck = function(taskName) {
    switch (taskName) {
      case 'GetUserClients':
        // These can be called by all authenticated users
        return true;
        break;
      default:
        // Everything else is for admins only
        return user.groups && user.groups.indexOf('SSO Dashboard Admins') > -1;
        break;
    }

  }


  var generateToken = function(taskName, callback) {
    var isAuthorized = authCheck(taskName);
    if (!isAuthorized) {
      return callback();
    }

    var webtaskUrl = "https://sandbox.it.auth0.com/api/tokens/issue";
    var url = util.format('https://s3-%s.amazonaws.com/%s/tasks/%s.js', process.env.AWS_REGION, process.env.AWS_S3_BUCKET, taskName);
    var data = {
      pctx: {
        user_id: user.user_id,
        auth0_domain: process.env.AUTH0_DOMAIN
      },
      ectx: {
        auth0_api_key: process.env.AUTH0_API_KEY,
      },
      url: url
    }

    request({
      url: webtaskUrl,
      method: 'POST',
      json: data,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + process.env.WEBTASK_API_KEY
      }
    }, function(error, response, body) {
      var result = { name: camelToSnake(taskName), token: body };
      callback(error, result);
    });
  };

  var tasks = ['GetUserClients', 'Auth0Proxy']

  async.map(tasks, generateToken, function(err, tokens) {
    user.task_tokens = {};
    tokens.map(function(obj) {
      if (obj) {
        user.task_tokens[obj.name] = obj.token;
      }
    });
    cb(err, user, context);
  });
}
