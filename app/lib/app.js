
var SsoDashboardApp = require('./components/SsoDashboardApp.react');
//var SectionStore = require('./stores/SectionStore');
var React = require('react');
window.React = React;


var SsoDashbaord = function(element) {
  React.render(
    <SsoDashboardApp />,
    element
  );
}

// RepoNavigator.prototype.init = function(data) {
//   //SectionStore.init(data.sections);
//   //RepoStore.init(data.repos);
// };


module.export = window.SsoDashbaord = SsoDashbaord;
