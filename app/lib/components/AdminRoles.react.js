var React = require('react');
var DataWebAPIUtils = require('../utils/DataWebAPIUtils');
var RoleStore = require('../stores/RoleStore');
var TokenStore = require('../stores/TokenStore');

function getStateFromStores() {
  return {
    token: TokenStore.get(),
    roles: RoleStore.getAll()
  };
}

var AdminRoles = React.createClass({
  getInitialState: function() {
    return getStateFromStores();
  },

  componentDidMount: function() {
    TokenStore.addChangeListener(this._onChange);
    RoleStore.addChangeListener(this._onChange);
    if (this.state.token) {
      DataWebAPIUtils.loadRoles(this.state.token);
    }
  },

  componentWillUnmount: function() {
    TokenStore.removeChangeListener(this._onChange);
    RoleStore.removeChangeListener(this._onChange);
  },

  handleClick: function(i) {
    var role = this.state.roles[i];
    console.log('edit');
  },

  render: function() {
    return (
      <div className="container">
        <div className="row page-header">
          <h2>Administration: Roles</h2>
        </div>
        <div className="row" id="apps">
          <table className="table">
            <thead>
              <tr>
                <td>Name</td>
                <td>All Apps</td>
                <td>Apps</td>
                <td width="20px"></td>
              </tr>
            </thead>
            <tbody>
              {this.state.roles.map(function(role, i) {
                var boundClick = this.handleClick.bind(this, i);
                var apps;
                if (role.apps) {
                  apps = role.apps.join(', ');
                }
                return (
                  <tr key={role.name}>
                    <td>{role.name}</td>
                    <td>{role.all_apps == true ? 'Yes' : 'No'}</td>
                    <td>{apps}</td>
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

module.exports = AdminRoles;
