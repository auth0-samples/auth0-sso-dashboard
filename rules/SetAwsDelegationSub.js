function(user, context, cb) {

  var config = configuration || process.env;

  if (context.clientID !== '{{auth0_client_id}}' &&
      context.isDelegation &&
      context.request.body.api_type === 'aws') {
    return cb(null, user, context);
  }

  var is_admin = user.groups && user.groups.indexOf('{{admin_group}}') > -1;
  if (is_admin) {
    user.sub = "role:admin";
  } else {
    user.sub = "role:user";
  }

  cb(null, user, context);
}
