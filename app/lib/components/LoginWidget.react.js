var React = require('react');
var AuthActions = require('../actions/AuthActions');
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
    }, (function(err, profile, token, access_token) {
      if (err) {
        // Error callback
        alert('There was an error');
      } else {
        AuthActions.authenticated(token, access_token);
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
