
var React = require('react');
var injectTapEventPlugin = require('react-tap-event-plugin');
injectTapEventPlugin();

window.React = React;

var App = require('./components/App.react');

document.title = config.title;
App.init();
