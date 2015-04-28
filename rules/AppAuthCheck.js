function(user, context, cb) {
  var token = jwt.sign({ sub: user.user_id, client_id: context.clientID }, configuration.AUTH0_DASHBOARD_APP_SECRET);
  request({
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + token
    }
  }, function(error, response) {
    if (response.statusCode !== 200) {
      callback(new UnauthorizedError('Access Denied.'));
    } else {
      callback(null, user, context);
    }
  });
}
