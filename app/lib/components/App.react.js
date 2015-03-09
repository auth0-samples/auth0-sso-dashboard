var React = require('react');
var Router = require('react-router');
var Navbar = require('./Navbar.react');
var LoginWidget = require('./LoginWidget.react');
var ProfileStore = require('../stores/ProfileStore');
var Mixins = require('../mixins');

function getStateFromStores() {
  return {
    profile: ProfileStore.get(),
  };
}

var App = React.createClass({
  mixins: [Mixins.TokenState],

  getInitialState: function() {
    return getStateFromStores();
  },

  componentDidMount: function() {
    ProfileStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    ProfileStore.removeChangeListener(this._onChange);
  },

  render: function() {
    var body = <LoginWidget/>;
    if (this.state.isAuthenticated) {
      body = <Router.RouteHandler />;
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

var AdminSection = require('./AdminSection.react');
var AdminUsers = require('./AdminUsers.react');
var AdminSettings = require('./AdminSettings.react');
var AdminApps = require('./AdminApps.react');
var AdminDashboard = require('./AdminDashboard.react');
var AdminRoles = require('./AdminRoles.react');
var SsoDashboardSection = require('./SsoDashboardSection.react');

var routes = (
  <Router.Route name="app" path="/" handler={App}>
    <Router.Route name="admin" handler={AdminSection}>
      <Router.Route name="admin-users" path="users" handler={AdminUsers} title="User Administration" />
      <Router.Route name="admin-settings" path="settings" handler={AdminSettings} />
      <Router.Route name="admin-apps" path="apps" handler={AdminApps} />
      <Router.Route name="admin-roles" path="roles" handler={AdminRoles} />
      <Router.DefaultRoute handler={AdminDashboard} />
    </Router.Route>
    <Router.DefaultRoute handler={SsoDashboardSection} />
  </Router.Route>
);

module.exports.init = function(config) {
  Router.run(routes, Router.HistoryLocation, function (Handler) {
    React.render(<Handler />, document.body);
  });
}
