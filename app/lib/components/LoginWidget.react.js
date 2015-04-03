var React = require('react');
var Actions = require('../Actions');
var Router = require('react-router');

var LoginWidget = React.createClass({
  mixins : [ Router.Navigation, Router.State ],

  render: function() {
    return (
      <div></div>
    );
  },

  componentDidMount: function() {
    var lock = window.lock;
    lock.show({
      closable: false,
      connections: [config.auth0_connection]
    }, (function(err, profile, token) {
      if (err) {
        // Error callback
        console.log(err);
      } else {
        Actions.authenticated(token);
        Actions.loadProfile(profile);
        var nextPath = this.getQuery().nextPath;

        if (nextPath) {
          this.transitionTo(nextPath);
        } else {
          this.transitionTo('/');
        }
      }
    }).bind(this));
  }
});

module.exports = LoginWidget;
