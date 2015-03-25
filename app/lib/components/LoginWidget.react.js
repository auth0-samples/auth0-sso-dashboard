var React = require('react');
var AuthActions = require('../actions/AuthActions');

var LoginWidget = React.createClass({
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
    }, function(err, profile, token, access_token) {
      if (err) {
        // Error callback
        alert('There was an error');
      } else {
        AuthActions.authenticated(token, access_token);
      }
    });
  }
});

module.exports = LoginWidget;
