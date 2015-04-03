var Dispatcher = require('../Dispatcher');
var Constants = require('../Constants');
var Store = require('./Store');

var ProfileStore = new Store({});

ProfileStore.getTaskTokens = function() {
  var profile = this.get();
  if (profile.task_tokens) {
    return profile.task_tokens;
  }
}

ProfileStore.getToken = function() {
  return store.get('token');
};

ProfileStore.setToken = function(token) {
  if (token) {
    store.set('token', token);
  } else {
    store.clear();
  }
};

ProfileStore.isAuthenticated = function() {
  var token = this.getToken();
  var profile = this.get();
  if (token && profile) {
    return true;
  }
  return false;
};

// Register callback to handle all updates
Dispatcher.register(function(action) {

  switch(action.actionType) {
    case Constants.RECEIVED_PROFILE:
      ProfileStore.set(action.profile);
      break;
    case Constants.USER_LOGGED_OUT:
      ProfileStore.set();
      ProfileStore.setToken();
      break;
    case Constants.USER_AUTHENTICATED:
      ProfileStore.setToken(action.token);
      break;
    default:
      // no op
  }
});

module.exports = ProfileStore;
