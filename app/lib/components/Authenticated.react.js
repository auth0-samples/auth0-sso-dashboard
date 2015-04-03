var React = require('react');
var Router = require('react-router');
var Navbar = require('./Navbar.react');
var TokenStore = require('../stores/TokenStore');

module.exports = React.createClass({
  statics: {
    willTransitionTo: function (transition) {
      var nextPath = transition.path;
      if (!TokenStore.isAuthenticated()) {
        transition.redirect('/login',{},
          { 'nextPath' : nextPath });
      }
    }
  },

  render: function() {
    return (
      <div>
        <Navbar />
        <Router.RouteHandler {...this.props} />
      </div>
    )
  }

});
