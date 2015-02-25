var React = require('react');
var Navbar = require('./Navbar.react');
var LoginWidget = require('./LoginWidget.react');
var TokenStore = require('../stores/TokenStore');
var ProfileStore = require('../stores/ProfileStore');
var ApplicationList = require('./ApplicationList.react');
var AdminSection = require('./AdminSection.react');
var UserAdminSection = require('./UserAdminSection.react');
var SettingsAdminSection = require('./SettingsAdminSection.react');
var AppAdminSection = require('./AppAdminSection.react');
var Router = require('../utils/Router').RouterMixin;

function getStateFromStores() {
  return {
    isAuthenticated: TokenStore.isAuthenticated(),
    profile: ProfileStore.getProfile(),
  };
}

var SsoDashboardApp = React.createClass({
  mixins: [Router],

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

  getSection: function() {
    var section;
    if (this.state.isAuthenticated) {
      switch(this.state.currentRoute) {
        case '/':
          section = <ApplicationList />
          break;
        case '/admin':
          section = <AdminSection />;
          break;
        case '/admin/users':
          section = <UserAdminSection />;
          break;
        case '/admin/clients':
          section = <AppAdminSection />;
          break;
        case '/admin/settings':
          section = <SettingsAdminSection />
          break;
        default:
          section = (
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
      section = <LoginWidget />
    }
    return section;
  },

  render: function() {
    var section = this.getSection();

    return (
      <div>
        <Navbar profile={this.state.profile} />
        {section}
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
