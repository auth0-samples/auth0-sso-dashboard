var React = require('react');
var AdminSettingsButton = require('./AdminSettingButton.react');
var UI = require('./UI.react');

var AdminDashboard = React.createClass({
  render: function() {
    return (
      <div className="container">
        <UI.PageHeader title="Administration" />
        <div className="row">
          <AdminSettingsButton name="Users" route="admin-users" icon="glyphicon-user" />
          <AdminSettingsButton name="Apps" route="admin-apps" icon="glyphicon-th" />
          <AdminSettingsButton name="Roles" route="admin-roles" icon="glyphicon-ok" />
        </div>
      </div>
    );
  }
});

module.exports = AdminDashboard;
