
var React = require('react');
window.React = React;

var App = require('./components/App.react');
var TokenStore = require('./stores/TokenStore');

var SsoDashboard = {
  init: function(config) {
    App.init(config);
    TokenStore.init();
  }
}

module.exports = window.SsoDashboard = SsoDashboard;
