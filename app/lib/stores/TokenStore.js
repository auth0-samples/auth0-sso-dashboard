var Dispatcher = require('../Dispatcher');
var Constants = require('../Constants');
var Store = require('./Store');
var AuthActions = require('../actions/AuthActions')

var TokenStore = new Store({});
TokenStore.get = function() {
  return {
    token: store.get('token'),
    access_token: store.get('access_token')
  };
};

TokenStore.set = function(token, access_token) {
  if (token && access_token) {
    store.set('token', token);
    store.set('access_token', access_token);
  } else {
    store.remove('token');
    store.remove('access_token')
  }
}
TokenStore.isAuthenticated = function() {
  var obj = this.get();
  if (obj && obj.token && obj.access_token) {
    return true;
  }
  return false;
};

TokenStore.init = function() {

  if (this.isAuthenticated()) {
    var obj = this.get();
    AuthActions.authenticated(obj.token, obj.access_token);
  }
}

// Register callback to handle all updates
Dispatcher.register(function(action) {

  switch(action.actionType) {
    case Constants.USER_AUTHENTICATED:
      TokenStore.set(action.token, action.access_token);
      break;
    case Constants.USER_LOGGED_OUT:
      TokenStore.set();
      break;
    default:
      // no op
  }
});

module.exports = TokenStore;
