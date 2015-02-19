var React = require('react');
var Navbar = require('./Navbar.react');
var LoginWidget = require('./LoginWidget.react');
var TokenStore = require('../stores/TokenStore');
var ApplicationList = require('./ApplicationList.react');

function getStateFromStores() {
  return {
    isAuthenticated: TokenStore.isAuthenticated()
  };
}

var SsoDashboardApp = React.createClass({
  getInitialState: function() {
    return getStateFromStores();
  },

  componentDidMount: function() {
    TokenStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    TokenStore.removeChangeListener(this._onChange);
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
        <Navbar />
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
