var React = require('react');

var AdminRoles = React.createClass({
  render: function() {
    return (
      <div className="container">
        <div className="row page-header">
          <h2>Administration: Roles</h2>
        </div>
        <div className="row" id="apps">
          Role Admin
        </div>
      </div>
    );
  }
});

module.exports = AdminRoles;
