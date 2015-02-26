var React = require('react');
var DataWebAPIUtils = require('../utils/DataWebAPIUtils');
var UserStore = require('../stores/UserStore');
var TokenStore = require('../stores/TokenStore');
var moment = require('moment');

function getStateFromStores() {
  return {
    token: TokenStore.get(),
    users: UserStore.getAll()
  };
}

var AdminUsers = React.createClass({
  getInitialState: function() {
    return getStateFromStores();
  },

  componentDidMount: function() {
    TokenStore.addChangeListener(this._onChange);
    UserStore.addChangeListener(this._onChange);
    if (this.state.token) {
      DataWebAPIUtils.loadUsers(this.state.token, {
        per_page: 10,
        page: 0
      });
    }
  },

  componentWillUnmount: function() {
    TokenStore.removeChangeListener(this._onChange);
    UserStore.removeChangeListener(this._onChange);
  },

  render: function() {
    var users = [];
    if (this.state.users) {
      this.state.users.map(function(user) {
        var roles;
        if (user.app_metadata && user.app_metadata.roles) {
          roles = user.app_metadata.roles.join(', ');
        }


        users.push(
          <tr>
            <td>{user.name}</td>
            <td>{user.email}</td>
            <td>{moment(user.last_login).fromNow()}</td>
            <td>{user.logins_count}</td>
            <td>{roles}</td>
          </tr>);
      });
    }

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
                <td>Login Count</td>
                <td>Roles</td>
              </tr>
            </thead>
            <tbody>
              {users}
            </tbody>
          </table>
        </div>
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

module.exports = AdminUsers;
