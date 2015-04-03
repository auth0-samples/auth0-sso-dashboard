var Dispatcher = require('../Dispatcher');
var Constants = require('../Constants');
var Store = require('./Store');

var TokenStore = new Store({});

TokenStore.get = function() {
  return store.get('token');
};

TokenStore.set = function(token) {
  if (token) {
    store.set('token', token);
  } else {
    store.clear();
  }
};

TokenStore.isAuthenticated = function() {
  var token = this.get();
  if (token) {
    return true;
  }
  return false;
};

// Register callback to handle all updates
Dispatcher.register(function(action) {

  switch(action.actionType) {
    case Constants.USER_AUTHENTICATED:
      TokenStore.set(action.token);
      break;
    case Constants.USER_LOGGED_OUT:
      TokenStore.set();
      break;
    default:
      // no op
  }
});

module.exports = TokenStore;
