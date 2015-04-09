var React = require('react');
var Router = require('react-router');
var Navbar = require('./Navbar.react');
var Auth = require('../Auth');

function getStateFromStores() {
  var tokens = Auth.getTaskTokens() || {};
  tokens.id_token = Auth.getIdToken();
  tokens.aws_credentials = Auth.getAwsCredentials();
  return {
    tokens: tokens,
    token_info: Auth.getTokenInfo()
  }
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

  logout: function() {
    Auth.logout();
    this.context.router.transitionTo('/login');
  },

  render: function() {
    // Check Auth status
    if (!Auth.isAuthenticated()) {
      var { router } = this.context;
      var nextPath = router.getCurrentPath();
      router.transitionTo('/login',{}, { 'nextPath' : nextPath });
      return (<div></div>)
    }

    if (this.state.token_info) {
      return (
        <div>
          <Navbar token_info={this.state.token_info} logout={this.logout} />
          <Router.RouteHandler {...this.props} tokens={this.state.tokens} />
        </div>
      )
    } else {
      return (<div></div>)
    }


  },

  _onChange: function() {
    this.setState(getStateFromStores());
  }

});
