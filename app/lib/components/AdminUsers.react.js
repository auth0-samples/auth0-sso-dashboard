var React = require('react');
var DataWebAPIUtils = require('../utils/DataWebAPIUtils');
var UserStore = require('../stores/UserStore');
var Mixins = require('../mixins');
var moment = require('moment');

function getStateFromStores() {
  return {
    users: UserStore.getAll()
  };
}

var AdminUsers = React.createClass({
  mixins: [Mixins.TokenState],

  getInitialState: function() {
    return getStateFromStores();
  },

  componentDidMount: function() {
    UserStore.addChangeListener(this._onChange);
    if (this.state.token) {
      DataWebAPIUtils.loadUsers(this.state.token, {
        per_page: 10,
        page: 0
      });
    }
  },

  componentWillUnmount: function() {
    UserStore.removeChangeListener(this._onChange);
  },

  handleClick: function(i) {
    var user = this.state.users[i];
    console.log('edit');
  },

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
                <td>Login Count</td>
                <td>Roles</td>
                <td width="20px"></td>
              </tr>
            </thead>
            <tbody>
              {this.state.users.map(function(user, i) {
                var boundClick = this.handleClick.bind(this, i);
                var roles;
                if (user.app_metadata && user.app_metadata.roles) {
                  roles = user.app_metadata.roles.join(', ');
                }
                return (
                  <tr key={user.user_id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{moment(user.last_login).fromNow()}</td>
                    <td>{user.logins_count}</td>
                    <td>{roles}</td>
                    <td><span className="table-button glyphicon glyphicon-cog" aria-hidden="true" onClick={boundClick}></span></td>
                  </tr>
                );
              }, this)}
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
