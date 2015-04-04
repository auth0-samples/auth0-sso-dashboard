var React = require('react');
var Auth = require('../Auth');
var Router = require('react-router');

var LoginWidget = React.createClass({
  mixins : [ Router.Navigation, Router.State ],

  render: function() {
    return (
      <div></div>
    );
  },

  componentDidMount: function() {
    Auth.login((function() {
      var nextPath = this.getQuery().nextPath;

      if (nextPath) {
        this.transitionTo(nextPath);
      } else {
        this.transitionTo('/');
      }
    }).bind(this));
  }
});

module.exports = LoginWidget;
