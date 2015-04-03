
var React = require('react');
var injectTapEventPlugin = require("react-tap-event-plugin");
injectTapEventPlugin();

window.React = React;

var App = require('./components/App.react');
var TokenStore = require('./stores/TokenStore');

var SsoDashboard = {
  init: function(config) {
    document.title = config.title;
    App.init(config);
  }
}

module.exports = window.SsoDashboard = SsoDashboard;
