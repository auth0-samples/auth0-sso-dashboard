var Dispatcher = require('./Dispatcher');
var Constants = require('./Constants');
var EventEmitter = require('events').EventEmitter;
var ProfileActions = require('./actions/ProfileActions');

var CHANGE_EVENT = "CHANGE";

var Auth = {

  emitter: new EventEmitter(),

  logout: function() {
    store.clear();
    Dispatcher.dispatch({
      actionType: Constants.USER_LOGGED_OUT
    });
  },

  login: function(callback) {
    var lock = window.lock;
    lock.show({
      closable: false,
      connections: [config.auth0_connection]
    }, (function(err, profile, token) {
      if (err) {
        // Error callback
        throw err;
        console.log(err);
      } else {
        this.authenticate(token, profile);
        callback();
      }
    }).bind(this));
  },

  authenticate: function(id_token, profile) {
    this.setIdToken(id_token);
    Dispatcher.dispatch({
      actionType: Constants.RECEIVED_PROFILE,
      profile: profile
    });
    Dispatcher.dispatch({
      actionType: Constants.USER_AUTHENTICATED,
      id_token: id_token
    });
  },

  reauthenticate: function() {
    var id_token = this.getIdToken();
    if (id_token) {
      ProfileActions.loadProfile(id_token);
    }
  },

  setIdToken: function(id_token) {
    store.set('id_token', id_token);
    this.emitChange();
  },

  getIdToken: function() {
    return store.get('id_token');
  },

  isAuthenticated: function() {
    var id_token = this.getIdToken();
    if (id_token) {
      return true;
    }
    return false;
  },

  setTaskTokens: function(task_tokens) {
    this.task_tokens = task_tokens;
    this.emitChange();
  },

  getTaskTokens: function() {
    return this.task_tokens;
  },

  loadAwsCredentials: function(is_admin) {
    var options = {
      id_token:  this.getIdToken(),
      client_id: config.auth0_client_id,
      role: is_admin ? config.aws_iam_admin : config.aws_iam_user,
      principal: config.aws_iam_principal
    };
    lock.$auth0.getDelegationToken(options, function(err, delegationResult) {
      if (err) throw err;
      Dispatcher.dispatch({
        actionType: Constants.AWS_CREDENTIALS_RECIEVED,
        credentials: delegationResult.Credentials
      });
    });
  },

  setAwsCredentials: function(credentials) {
    this.aws_creds = credentials;
    this.emitChange();
  },

  getAwsCredentials: function() {
    return this.aws_creds;
  },

  emitChange: function() {
    this.emitter.emit(CHANGE_EVENT);
  },

  addChangeListener: function(callback) {
    this.emitter.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function(callback) {
    this.emitter.removeListener(CHANGE_EVENT, callback);
  },
}

module.exports = Auth;

Dispatcher.register(function(action) {

  switch(action.actionType) {
    case Constants.AWS_CREDENTIALS_RECIEVED:
      Auth.setAwsCredentials(action.credentials);
      break;
    case Constants.RECEIVED_PROFILE:
      Auth.loadAwsCredentials(action.profile.is_admin);
      Auth.setTaskTokens(action.profile.task_tokens);
      break;
    default:
      // no op
  }
});
