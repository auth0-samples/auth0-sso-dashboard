var React = require('react');
var Router = require('react-router');
var Navbar = require('./Navbar.react');
var Auth = require('../Auth');

function getStateFromStores() {
  var tokens = Auth.getTaskTokens() || {};
  tokens.auth = Auth.getIdToken();
  tokens.aws_credentials = Auth.getAwsCredentials();
  return tokens;
}

module.exports = React.createClass({

  getInitialState: function() {
    return getStateFromStores();
  },

  componentDidMount: function() {
    Auth.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    Auth.removeChangeListener(this._onChange);
  },

  statics: {
    willTransitionTo: function (transition) {
      var nextPath = transition.path;
      if (!Auth.isAuthenticated()) {
        transition.redirect('/login',{},
          { 'nextPath' : nextPath });
      }
    }
  },

  render: function() {
    return (
      <div>
        <Navbar />
        <Router.RouteHandler {...this.props} tokens={this.state} />
      </div>
    )
  },

  _onChange: function() {
    this.setState(getStateFromStores());
  }

});
