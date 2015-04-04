var Dispatcher = require('../Dispatcher');
var Constants = require('../Constants');
var Store = require('./Store');

var ProfileStore = new Store({});
// 
// ProfileStore.getTaskTokens = function() {
//   var profile = this.get();
//   if (profile.task_tokens) {
//     return profile.task_tokens;
//   }
// }
//
// ProfileStore.getToken = function() {
//   return store.get('id_token');
// };
//
// ProfileStore.setToken = function(id_token) {
//   if (id_token) {
//     store.set('id_token', id_token);
//   } else {
//     store.clear();
//   }
// };
//
// ProfileStore.getAwsCredentials = function() {
//   return ProfileStore.aws_creds;
// }
//
// ProfileStore.setAwsCredentials = function(credentials) {
//   ProfileStore.aws_creds = credentials;
// }
//
// ProfileStore.isAuthenticated = function() {
//   var token = this.getToken();
//   var profile = this.get();
//   if (token && profile) {
//     return true;
//   }
//   return false;
// };

// Register callback to handle all updates
Dispatcher.register(function(action) {

  switch(action.actionType) {
    case Constants.USER_LOGGED_OUT:
      ProfileStore.set();
      break;
    case Constants.RECEIVED_PROFILE:
      ProfileStore.set(action.profile);
      break;
    default:
      // no op
  }
});

module.exports = ProfileStore;
