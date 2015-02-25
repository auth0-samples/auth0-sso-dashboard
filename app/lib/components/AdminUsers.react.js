var React = require('react');

var AdminUsers = React.createClass({
  render: function() {
    return (
      <div className="container">
        <div className="row page-header">
          <h2>Administration: Users</h2>
        </div>
        <div className="row" id="apps">
          <table className="table">
            <thead>
              <tr>
                <td>Name</td>
                <td>Email</td>
                <td>Latest Login</td>
                <td>Roles</td>
              </tr>
            </thead>
            <tbody>
            </tbody>
          </table>
        </div>
      </div>
    );
  }
});

module.exports = AdminUsers;
