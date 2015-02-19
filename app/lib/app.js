
var SsoDashboardApp = require('./components/SsoDashboardApp.react');
var TokenStore = require('./stores/TokenStore');
var React = require('react');
window.React = React;


var SsoDashbaord = function(element) {
  React.render(
    <SsoDashboardApp />,
    element
  );
}

SsoDashbaord.prototype.init = function() {
  TokenStore.init();
};


module.export = window.SsoDashbaord = SsoDashbaord;
