var React = require('react');
var AdminSettingsButton = require('./AdminSettingButton.react');

var AdminDashboard = React.createClass({
  render: function() {
    return (
      <div className="container">
        <div className="row page-header">
          <h2>Administration</h2>
        </div>
        <div className="row" id="apps">
          <AdminSettingsButton name="Settings" route="admin-settings" icon="glyphicon-cog" />
          <AdminSettingsButton name="Users" route="admin-users" icon="glyphicon-user" />
          <AdminSettingsButton name="Apps" route="admin-apps" icon="glyphicon-th" />
          <AdminSettingsButton name="Roles" route="admin-roles" icon="glyphicon-ok" />
        </div>
      </div>
    );
  }
});

module.exports = AdminDashboard;
