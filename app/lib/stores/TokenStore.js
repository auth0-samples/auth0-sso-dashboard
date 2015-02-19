
var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var AppConstants = require('../constants/AppConstants');
var assign = require('object-assign');

var CHANGE_EVENT = 'change';

function setAuthToken(token) {
  store.set('token', token);
}

function getAuthToken() {
  return store.get('token');
}

var TokenStore = assign({}, EventEmitter.prototype, {

  init: function() {
    var token = getAuthToken();
    if (token) {
      this.emitChange();
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
    return getAuthToken() !== null;
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

    default:
      // no op
  }
});

module.exports = TokenStore;