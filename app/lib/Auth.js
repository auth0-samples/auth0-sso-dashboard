var Dispatcher = require('./Dispatcher');
var Constants = require('./Constants');
var EventEmitter = require('events').EventEmitter;
var ProfileActions = require('./actions/ProfileActions');
var API = require('./API');

var CHANGE_EVENT = "CHANGE";

var Auth = {

  emitter: new EventEmitter(),

  logout: function() {
    this.clearSession();
    Dispatcher.dispatch({
      actionType: Constants.USER_LOGGED_OUT
    });
  },

  clearSession: function() {
    this.task_tokens = null;
    this.aws_creds = null;
    store.remove('id_token');
    this.emitChange();
  },

  login: function(callback) {
    var lock = window.lock;
    lock.show({
      closable: false,
      connections: [config.auth0_connection]
    }, (function(err, token_info, token) {
      if (err) {
        // Error callback
        throw err;
        console.log(err);
      } else {
        this.authenticate(token, token_info);
        callback();
      }
    }).bind(this));
  },

  authenticate: function(id_token, token_info) {
    this.setIdToken(id_token);
    Dispatcher.dispatch({
      actionType: Constants.RECEIVED_TOKEN_INFO,
      token_info: token_info
    });
    Dispatcher.dispatch({
      actionType: Constants.USER_AUTHENTICATED,
      id_token: id_token
    });
  },

  reauthenticate: function() {
    var id_token = this.getIdToken();
    if (id_token) {
      API.loadTokenInfo(id_token);
    }
  },

  setTokenInfo: function(token_info) {
    this.token_info = token_info;
    this.emitChange();
  },

  getTokenInfo: function() {
    return this.token_info;
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
    lock.$auth0.getDelegationToken(options, (function(err, delegationResult) {
      if (err) throw err;
      this.setAwsCredentials(delegationResult.Credentials);
    }).bind(this));
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
    case Constants.USER_LOGGED_OUT:
      Auth.clearSession();
      break;
    case Constants.RECEIVED_TOKEN_INFO:
      Auth.setTokenInfo(action.token_info);
      Auth.loadAwsCredentials(action.token_info.is_admin);
      Auth.setTaskTokens(action.token_info.task_tokens);
      break;
    default:
      // no op
  }
});
