function(user, context, cb) {

  if (context.clientID !== '<YOUR APP ID HERE>') {
    return cb(null, user, context);
  }

  // TODO: Perform check to see if user is admin of the dashboard app
  
  // user.is_admin = user.app_metadata && user.app_metadata.roles.indexOf(<YOUR ROLE ID HERE>) > -1;
  user.is_admin = user.groups && user.groups.indexOf('<YOUR GROUUP HERE>') > -1;
  cb(null, user, context);
}
