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
          <AdminSettingsButton name="Settings" route="admin-settings" icon="icon-budicon-330" />
          <AdminSettingsButton name="Users" route="admin-users" icon="icon-budicon-292" />
          <AdminSettingsButton name="Apps" route="admin-apps" icon="icon-budicon-375" />
          <AdminSettingsButton name="Roles" route="admin-roles" icon="icon-budicon-294" />
        </div>
      </div>
    );
  }
});

module.exports = AdminDashboard;
