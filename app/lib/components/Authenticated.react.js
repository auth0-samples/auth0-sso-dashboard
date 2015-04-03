var React = require('react');
var Router = require('react-router');
var Navbar = require('./Navbar.react');
var ProfileStore = require('../stores/ProfileStore');

function getStateFromStores() {
  var tokens = ProfileStore.getTaskTokens() || {};
  tokens.auth = ProfileStore.getToken();
  return tokens;
}

module.exports = React.createClass({

  getInitialState: function() {
    return getStateFromStores();
  },

  componentDidMount: function() {
    ProfileStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    ProfileStore.removeChangeListener(this._onChange);
  },

  statics: {
    willTransitionTo: function (transition) {
      var nextPath = transition.path;
      if (!ProfileStore.isAuthenticated()) {
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
