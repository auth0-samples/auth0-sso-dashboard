require('./styles/main.less');

import React from 'react';
import Auth from './lib/Auth';
import Router from 'react-router';
import injectTapEventPlugin from 'react-tap-event-plugin';

// Setup
document.title = __SITE_TITLE__;
window.React = React;
injectTapEventPlugin();

// Routes
import App from './lib/components/App.react';
var Authenticated = require('./lib/components/Authenticated.react');
var AdminSection = require('./lib/components/AdminSection.react');
var AdminUsers = require('./lib/components/AdminUsers.react');
var AdminApps = require('./lib/components/AdminApps.react');
var AdminDashboard = require('./lib/components/AdminDashboard.react');
var AdminRoles = require('./lib/components/AdminRoles.react');
var SsoDashboardSection = require('./lib/components/SsoDashboardSection.react');
var UserProfile = require('./lib/components/UserProfileSection.react');
var LoginWidget = require('./lib/components/LoginWidget.react');

var routes = (
  <Router.Route name="app" path="/" handler={App}>
    <Router.Route name="login" path="/login" handler={LoginWidget} />
    <Router.Route handler={Authenticated}>
      <Router.Route name="admin" handler={AdminSection}>
        <Router.Route name="admin-users" path="users" handler={AdminUsers} title="User Administration" />
        <Router.Route name="admin-apps" path="apps" handler={AdminApps} />
        <Router.Route name="admin-roles" path="roles" handler={AdminRoles} />
        <Router.DefaultRoute handler={AdminDashboard} />
      </Router.Route>
      <Router.Route name="user-profile" path="profile" handler={UserProfile} />
      <Router.DefaultRoute handler={SsoDashboardSection} />
    </Router.Route>
  </Router.Route>
);

Router.run(routes, function (Handler, state) {
  React.render(<Handler {...state} />, document.body);
  Auth.reauthenticate();
});
