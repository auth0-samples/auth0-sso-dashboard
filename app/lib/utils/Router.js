var EventEmitter = require('events').EventEmitter;
var AppConstants = require('../constants/AppConstants');
var assign = require('object-assign');

var NAVIGATED_EVENT = 'navigated';

var Router = assign({}, EventEmitter.prototype, {

  navigate: function(route) {
    window.history.pushState(route, undefined, route);
    this.emitNavigated();
  },

  getRoute: function() {
    var state = window.history.state;
    if (state && state.path) {
      return state.path;
    } else {
      return window.location.pathname;
    }
  },

  emitNavigated: function() {
    this.emit(NAVIGATED_EVENT);
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

// This is not exactly 'react' friendly because if you navigate too
// quickly you can end up setting state on unmounted components which
// will cause an error.
window.onpopstate = function(event) {
  Router.emitNavigated();
}

function getState() {
  return {
    currentRoute: Router.getRoute()
  }
}



var RouterMixin = {
  getInitialState: function() {
    return getState();
  },

  navigate: function(route) {
    Router.navigate(route);
  },

  componentWillMount: function() {
    this.currentRoute = Router.getRoute();
  },

  componentDidMount: function() {
    Router.addNavigatedListener(this._onNavigationChange);
  },

  componentWillUnmount: function() {
    Router.removeNavigatedListener(this._onNavigationChange);
  },

  _onNavigationChange: function() {
    this.setState(getState());
  }
};

module.exports.Router = Router;
module.exports.RouterMixin = RouterMixin;
