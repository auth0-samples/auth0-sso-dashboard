var Dispatcher = require('./Dispatcher');
var Constants = require('./Constants');
var EventEmitter = require('events').EventEmitter;
var API = require('./API');
var CHANGE_EVENT = 'CHANGE';

var Auth = {

  emitter: new EventEmitter(),
  lock: new Auth0Lock(__AUTH0_CLIENT_ID__, __AUTH0_DOMAIN__),

  logout: function() {
    this.clearSession();
    Dispatcher.dispatch({
      actionType: Constants.USER_LOGGED_OUT
    });
  },

  clearSession: function() {
    store.remove('id_token');
    this.emitChange();
  },

  login: function(callback) {
    this.lock.show({
      authParams: {
        scope: 'openid is_admin'
      },
      closable: false,
      connections: [__AUTH0_CONNECTION__]
    }, (function(err, token_info, token) {
      if (err) {
        // Error callback
        console.log(err);
        throw err;
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

  emitChange: function() {
    this.emitter.emit(CHANGE_EVENT);
  },

  addChangeListener: function(callback) {
    this.emitter.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function(callback) {
    this.emitter.removeListener(CHANGE_EVENT, callback);
  }
};

module.exports = Auth;

Dispatcher.register(function(action) {

  switch (action.actionType) {
    case Constants.USER_LOGGED_OUT:
      Auth.clearSession();
      break;
    case Constants.RECEIVED_TOKEN_INFO:
      Auth.setTokenInfo(action.token_info);
      break;
    default:
      // no op
  }
});
