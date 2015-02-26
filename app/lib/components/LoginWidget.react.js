var React = require('react');
var AuthActionCreators = require('../actions/AuthActionCreators');

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
      connections: [config.default_connection]
    }, function(err, profile, token) {
      if (err) {
        // Error callback
        alert('There was an error');
      } else {
        AuthActionCreators.authenticated(token);
      }
    });
  }
});

module.exports = LoginWidget;
