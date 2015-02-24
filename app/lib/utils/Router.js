var EventEmitter = require('events').EventEmitter;
var AppConstants = require('../constants/AppConstants');
var assign = require('object-assign');

var NAVIGATED_EVENT = 'navigated';

module.exports = assign({}, EventEmitter.prototype, {
  navigate: function(route) {
    window.history.pushState(route, undefined, route);
    this.emit(NAVIGATED_EVENT);
  },

  getRoute: function() {
    var state = window.history.state;
    if (state && state.path) {
      return state.path;
    } else {
      return window.location.pathname;
    }
  },

  /**
   * @param {function} callback
   */
  addNavigatedListener: function(callback) {
    this.on(NAVIGATED_EVENT, callback);
  },

  /**
   * @param {function} callback
   */
  removeNavigatedListener: function(callback) {
    this.removeListener(NAVIGATED_EVENT, callback);
  }
});
