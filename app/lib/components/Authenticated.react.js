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
  contextTypes: {
    router: React.PropTypes.func
  },

  getInitialState: function() {
    return getStateFromStores();
  },

  componentDidMount: function() {
    Auth.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    Auth.removeChangeListener(this._onChange);
  },

  render: function() {
    // Check Auth status
    if (!Auth.isAuthenticated()) {
      var { router } = this.context;
      var nextPath = router.getCurrentPath();
      router.transitionTo('/login',{}, { 'nextPath' : nextPath });
      return (<div></div>)
    }

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
