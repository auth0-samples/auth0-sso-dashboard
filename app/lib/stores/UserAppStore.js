
var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var AppConstants = require('../constants/AppConstants');
var assign = require('object-assign');

var CHANGE_EVENT = 'change';

var _apps = [];
function setApps(apps) {
  _apps = apps;
}

function getApps() {
  return _apps;
}

var UserAppStore = assign({}, EventEmitter.prototype, {

  /**
   * Get the entire collection of TODOs.
   * @return {object}
   */
  getAll: function() {
    return getApps();
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
    case AppConstants.RECEIVED_USER_APPS:
      setApps(action.apps);
      UserAppStore.emitChange();
      break;
    case AppConstants.USER_LOGGED_OUT:
      setApps();
      UserAppStore.emitChange();
    default:
      // no op
  }
});

module.exports = UserAppStore;
