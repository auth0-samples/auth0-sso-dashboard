var React = require('react');
var UserActions = require('../actions/UserActions');
var RoleActions = require('../actions/RoleActions');
var UserStore = require('../stores/UserStore');
var RoleStore = require('../stores/RoleStore');
var moment = require('moment');
var UI = require('./UI.react');
var BS = require('react-bootstrap');
var _ = require('lodash');

function getStateFromStores() {
  return {
    roles: RoleStore.get(),
    users: UserStore.get()
  };
}

var AdminUsers = React.createClass({

  getInitialState: function() {
    return getStateFromStores();
  },

  componentDidMount: function() {
    UserStore.addChangeListener(this._onChange);
    RoleStore.addChangeListener(this._onChange);
    if (this.props.token) {
      UserActions.getUsers(this.props.token);
      RoleActions.getRoles(this.props.token);
    }
  },

  componentWillUnmount: function() {
    UserStore.removeChangeListener(this._onChange);
    RoleStore.removeChangeListener(this._onChange);
  },

  saveRoles: function(user_id, roles) {
    UserActions.saveUserRoles(this.props.token, user_id, roles);
  },

  render: function() {
    return (
      <div className="container">
        <UI.PageHeader title="Administration: Users" />
        <div className="row" id="apps">
          <table className="table">
            <thead>
              <tr>
                <td>Name</td>
                <td>Email</td>
                <td>Latest Login</td>
                {/*<td>Login Count</td>*/}
                <td>Roles</td>
                <td width="20px"></td>
              </tr>
            </thead>
            <tbody>
              {this.state.users.map(function(user, i) {
                var role_names = [];
                user.roles.map(function(role_id) {
                  var role = _.find(this.state.roles, { id: role_id});
                  if (role) {
                    role_names.push(role.name);
                  } else {
                    // Role has probably been deleted
                    //role_names.push(role_id);
                    console.warn('Role not found: ' + role_id);
                  }
                }, this);

                return (
                  <tr key={user.user_id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{moment(user.last_login).fromNow()}</td>
                    {/* <td>{user.logins_count}</td> */}
                    <td>
                      <ul className="role-list">
                      {role_names.map(function(role) {
                        return (<li key={role}>{role}</li>);
                      })}
                      </ul>
                    </td>
                    <td>
                      <BS.ModalTrigger modal={<RolesModal roles={this.state.roles} user={user} onRolesSaved={this.saveRoles} />}>
                        <span className="table-button glyphicon glyphicon-cog" aria-hidden="true"></span>
                      </BS.ModalTrigger>
                    </td>
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


var Forms = require('./Forms.react');

var RolesModal = React.createClass({
  getInitialState: function() {
    return {
      selected_roles: []
    };
  },

  componentWillReceiveProps: function(nextProps) {
    var selected_roles = [];
    if (nextProps.profile.user_metadata) {
      selected_roles = nextProps.user.roles;
    }
    this.setState({ selected_roles: selected_roles });
  },


  render: function() {
    return(
      <BS.Modal {...this.props} animation={false} title="Edit App">
        <div className="modal-body">
          <form className="form-horizontal">
            <Forms.TextInput name="name" label="Name" placeholder="Name" value={this.props.user.name} disabled="true" />
            {this.props.roles.map(function(role, i) {
              var checked = this.state.selected_roles.indexOf(role.id) > -1;
              return (
                <Forms.Checkbox key={role.id} name={role.id} label={role.name} checked={checked} onChange={this.onRoleSelected} />
              );
            }, this)}
          </form>
        </div>
        <div className="modal-footer">
          <BS.Button onClick={this.props.onRequestHide}>Close</BS.Button>
          <BS.Button className="btn btn-primary" onClick={this.saveChanges}>Save changes</BS.Button>
        </div>
      </BS.Modal>
    )
  },

  saveChanges: function() {
    // TODO: Validation logic
    var roles = this.state.selected_roles;
    this.props.onRolesSaved(this.props.user.user_id, roles);
    this.props.onRequestHide();
  },

  onRoleSelected: function(event) {
    var roles = this.state.selected_roles;
    var id = event.target.name;
    var i = roles.indexOf(id);
    if (i > -1) {
      roles.splice(i, 1);
    } else {
      roles.push(id);
    }
    this.setState({ selected_roles: roles });
  }

});



module.exports = AdminUsers;
