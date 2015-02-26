
var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var AppConstants = require('../constants/AppConstants');
var assign = require('object-assign');

var CHANGE_EVENT = 'change';

var _roles = [];
function setRoles(roles) {
  _roles = roles;
}

function getRoles() {
  return _roles;
}

var RoleStore = assign({}, EventEmitter.prototype, {

  /**
   * Get the entire collection of TODOs.
   * @return {object}
   */
  getAll: function() {
    return getRoles();
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
    case AppConstants.RECEIVED_ROLES:
      setRoles(action.roles);
      RoleStore.emitChange();
      break;
    case AppConstants.USER_LOGGED_OUT:
      setRoles();
      RoleStore.emitChange();
    default:
      // no op
  }
});

module.exports = RoleStore;
