
var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var AppConstants = require('../constants/AppConstants');
var assign = require('object-assign');
var AuthActionCreators = require('../actions/AuthActionCreators');

var CHANGE_EVENT = 'change';

function setAuthToken(token) {
  if (token) {
    store.set('token', token);
  } else {
    store.remove('token');
  }
}

function getAuthToken() {
  return store.get('token');
}

var TokenStore = assign({}, EventEmitter.prototype, {

  init: function() {
    var token = getAuthToken();
    if (token) {
      AuthActionCreators.authenticated(token);
    }
  },

  /**
   * Get the entire collection of TODOs.
   * @return {object}
   */
  get: function() {
    return getAuthToken();
  },

  isAuthenticated: function() {
    return getAuthToken() !== undefined;
  },

  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  /**
   * @param {function} callback
   */
  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  /**
   * @param {function} callback
   */
  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  }
});

// Register callback to handle all updates
AppDispatcher.register(function(action) {

  switch(action.actionType) {
    case AppConstants.USER_AUTHENTICATED:
      setAuthToken(action.token);
      TokenStore.emitChange();
      break;
    case AppConstants.USER_LOGGED_OUT:
      setAuthToken();
      TokenStore.emitChange();
      break;

    default:
      // no op
  }
});

module.exports = TokenStore;
