var React = require('react');
var Navbar = require('./Navbar.react');
var LoginWidget = require('./LoginWidget.react');
var TokenStore = require('../stores/TokenStore');
var ProfileStore = require('../stores/ProfileStore');
var ApplicationList = require('./ApplicationList.react');
var AdminSection = require('./AdminSection.react');
var Router = require('../utils/Router');

function getStateFromStores() {
  return {
    isAuthenticated: TokenStore.isAuthenticated(),
    profile: ProfileStore.getProfile(),
    route: Router.getRoute()
  };
}

var SsoDashboardApp = React.createClass({
  getInitialState: function() {
    return getStateFromStores();
  },

  componentDidMount: function() {
    TokenStore.addChangeListener(this._onChange);
    ProfileStore.addChangeListener(this._onChange);
    Router.addNavigatedListener(this._onChange);
  },

  componentWillUnmount: function() {
    TokenStore.removeChangeListener(this._onChange);
    ProfileStore.removeChangeListener(this._onChange);
    Router.removeNavigatedListener(this._onChange);
  },

  render: function() {
    var body;
    if (this.state.isAuthenticated) {
      switch(this.state.route) {
        case '/':
          body = <ApplicationList />
          break;
        case '/admin':
          body = (<AdminSection />);
          break;
        default:
          body = (
            <div className="container">
              <div className="row page-header">
                <h2>404: Page Not Found</h2>
              </div>
              <div className="row" id="apps">
                <h3>We couldn't find what you are looking for.</h3>
              </div>
            </div>
          );
      }
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
