
var AppDispatcher = require('../dispatcher/AppDispatcher');
var AppConstants = require('../constants/AppConstants');
var Store = require('./Store');
var AuthActionCreators = require('../actions/AuthActionCreators')

var TokenStore = new Store({});
TokenStore.get = function() {
  return store.get('token');
};

TokenStore.set = function(token) {
  if (token) {
    store.set('token', token);
  } else {
    store.remove('token');
  }
}
TokenStore.isAuthenticated = function() {
  var token = this.get();
  if (token) {
    return true;
  }
  return false;
};

TokenStore.init = function() {
  var token = this.get();
  if (token) {
    AuthActionCreators.authenticated(token);
  }
}

// Register callback to handle all updates
AppDispatcher.register(function(action) {

  switch(action.actionType) {
    case AppConstants.USER_AUTHENTICATED:
      TokenStore.set(action.token);
      break;
    case AppConstants.USER_LOGGED_OUT:
      TokenStore.set();
      break;

    default:
      // no op
  }
});

module.exports = TokenStore;
