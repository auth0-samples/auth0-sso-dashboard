var React = require('react');
var Navbar = require('./Navbar.react');
var LoginWidget = require('./LoginWidget.react');
var TokenStore = require('../stores/TokenStore');
var ProfileStore = require('../stores/ProfileStore');
var ApplicationList = require('./ApplicationList.react');

function getStateFromStores() {
  return {
    isAuthenticated: TokenStore.isAuthenticated(),
    profile: ProfileStore.getProfile(),
  };
}

var SsoDashboardApp = React.createClass({
  getInitialState: function() {
    return getStateFromStores();
  },

  componentDidMount: function() {
    TokenStore.addChangeListener(this._onChange);
    ProfileStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    TokenStore.removeChangeListener(this._onChange);
    ProfileStore.removeChangeListener(this._onChange);
  },

  render: function() {
    var body;
    if (this.state.isAuthenticated) {
      body = <ApplicationList />
    } else {
      body = <LoginWidget />
    }
    return (
      <div>
        <Navbar profile={this.state.profile} />
        {body}
      </div>
    );
  },

  /**
   * Event handler for 'change' events coming from the stores
   */
  _onChange: function() {
    this.setState(getStateFromStores());
  }
});

module.exports = SsoDashboardApp;
