var React = require('react');
var AdminSettingsButton = require('./AdminSettingButton.react');
var UI = require('./UI.react');

var AdminDashboard = React.createClass({
  render: function() {
    return (
      <div className="container">
        <UI.PageHeader title="Administration" />
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
