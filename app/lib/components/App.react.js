var React = require('react');
var Router = require('react-router');

var Navbar = require('./Navbar.react');
var LoginWidget = require('./LoginWidget.react');
var TokenStore = require('../stores/TokenStore');
var ProfileStore = require('../stores/ProfileStore');
var SsoDashboardSection = require('./SsoDashboardSection.react');

var AdminSection = require('./AdminSection.react');
var AdminUsers = require('./AdminUsers.react');
var AdminSettings = require('./AdminSettings.react');
var AdminApps = require('./AdminApps.react');
var AdminDashboard = require('./AdminDashboard.react');
var AdminRoles = require('./AdminRoles.react')


var DefaultRoute = Router.DefaultRoute;
var Link = Router.Link;
var Route = Router.Route;
var RouteHandler = Router.RouteHandler;

function getStateFromStores() {
  return {
    isAuthenticated: TokenStore.isAuthenticated(),
    profile: ProfileStore.getProfile(),
  };
}

var App = React.createClass({

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
    var body = <LoginWidget/>;
    if (this.state.isAuthenticated) {
      body = <RouteHandler {...this.props} />;
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

var routes = (
  <Route name="app" path="/" handler={App}>
    <Route name="admin" handler={AdminSection}>
      <Route name="admin-users" path="users" handler={AdminUsers} title="User Administration" />
      <Route name="admin-settings" path="settings" handler={AdminSettings} />
      <Route name="admin-apps" path="apps" handler={AdminApps} />
      <Route name="admin-roles" path="roles" handler={AdminRoles} />
      <DefaultRoute handler={AdminDashboard} />
    </Route>
    <DefaultRoute handler={SsoDashboardSection} />
  </Route>
);

module.exports.init = function(config) {
  Router.run(routes, Router.HistoryLocation, function (Handler, state) {
    React.render(<Handler />, document.body);
  });
}
