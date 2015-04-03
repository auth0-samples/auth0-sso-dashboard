var React = require('react');
var ProfileActions = require('../actions/ProfileActions');
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
        ProfileActions.authenticated(token);
        ProfileActions.receiveProfile(profile);
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
