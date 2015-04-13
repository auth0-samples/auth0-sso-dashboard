var React = require('react');
var RoleStore = require('../stores/RoleStore');
var AppStore = require('../stores/AppStore');
var AppActions = require('../actions/AppActions');
var RoleActions = require('../actions/RoleActions');
var UI = require('./UI.react');
var BS = require('react-bootstrap');
var _ = require('lodash');
var Forms = require('./Forms.react');

var RoleModal = React.createClass({
  getInitialState: function() {
    var role = this.props.role || {};
    var groups;
    if (role.groups) {
      groups = role.groups.join(', ');
    } else {
      groups = '';
    }
    return {
      id: role.id,
      name: role.name,
      groups: groups,
      all_apps: role.all_apps || false,
      apps: role.apps || []
    };
  },

  render: function() {

    var appList = [];

    if (!this.state.all_apps) {
      this.props.apps.map((function(app, i) {
        var checked = this.state.apps.indexOf(app.client_id) > -1;
        appList.push(<Forms.Checkbox key={app.client_id} name={app.client_id} label={app.name} checked={checked} onChange={this.onAppSelected} />);
      }).bind(this));
    }

    return(
      <BS.Modal {...this.props} animation={false} title="New Role">
        <div className="modal-body">
          <form className="form-horizontal">
            <Forms.TextInput name="name" label="Name" placeholder="Name" value={this.state.name} onChange={this.onNameChanged} />
            <Forms.TextInput name="groups" label="Map from Groups" placeholder="Group1, Group 2" value={this.state.groups} onChange={this.onGroupsChanged} />
            <Forms.RadioGroup label="Apps">
              <Forms.Radio label="All Apps" name="all_apps" value="1" checked={this.state.all_apps} onChange={this.allAppsChanged} />
              <Forms.Radio label="Specific Apps" name="all_apps" value="0" checked={!this.state.all_apps} onChange={this.allAppsChanged} />
            </Forms.RadioGroup>
            {appList}
          </form>
        </div>
        <div className="modal-footer">
          <BS.Button onClick={this.props.onRequestHide}>Close</BS.Button>
          <BS.Button className="btn btn-primary" onClick={this.saveChanges}>Save changes</BS.Button>
        </div>
      </BS.Modal>
    );
  },

  saveChanges: function() {
    // TODO: Validation logic
    var groups = [];
    if (this.state.groups) {
      this.state.groups.split(',').map(function(g) {
        groups.push(g.trim());
      });
    }
    var role = {
      id: this.state.id,
      name: this.state.name,
      groups: groups,
      all_apps: this.state.all_apps,
      apps: this.state.apps
    };
    this.props.onRoleSaved(role);
    this.props.onRequestHide();
  },

  allAppsChanged: function(event) {
    var all_apps = event.target.value === '1';
    this.setState({all_apps: all_apps });
    if (all_apps) {
      this.setState({ apps: [] }) ;
    }
  },

  onNameChanged: function(event) {
    this.setState({name: event.target.value });
  },

  onGroupsChanged: function(event) {
    this.setState({groups: event.target.value });
  },

  onAppSelected: function(event) {
    var apps = this.state.apps;
    var client_id = event.target.name;
    var i = apps.indexOf(client_id);
    if (i > -1) {
      apps.splice(i, 1);
    } else {
      apps.push(client_id);
    }
    this.setState({ apps: apps });
  }

});

function getStateFromStores() {
  return {
    roles: RoleStore.get(),
    apps: AppStore.get()
  };
}

var AdminRoles = React.createClass({

  getInitialState: function() {
    return getStateFromStores();
  },

  componentDidMount: function() {
    RoleStore.addChangeListener(this._onChange);
    AppStore.addChangeListener(this._onChange);
    this.updateDataIfNeeded(this.props);
  },

  componentWillReceiveProps: function(nextProps) {
    this.updateDataIfNeeded(nextProps);
  },

  updateDataIfNeeded: function(props) {
    // TODO: Determine if data should be loaded
    if (props.tokens.auth0_proxy && props.tokens.aws_credentials) {
      AppActions.loadApps(props.tokens.auth0_proxy, props.tokens.aws_credentials);
    }

    if (props.tokens.aws_credentials) {
      RoleActions.loadRoles(props.tokens.aws_credentials);
    }
  },

  componentWillUnmount: function() {
    RoleStore.removeChangeListener(this._onChange);
    AppStore.removeChangeListener(this._onChange);
  },

  saveRole: function(role) {
    RoleActions.save(this.props.tokens.aws_credentials, role);
  },

  deleteRole: function(role) {
    RoleActions.delete(this.props.tokens.aws_credentials, role.id);
  },

  render: function() {
    var content;
    var data_ready = (this.state.apps.length > 0) && (this.state.roles.length > 0);


    if (data_ready) {
      content = (
        <table className="table">
          <thead>
            <tr>
              <td>Name</td>
              <td>All Apps</td>
              <td>Apps</td>
              <td width="20px"></td>
              <td width="20px"></td>
            </tr>
          </thead>
          <tbody>
            {this.state.roles.map(function(role, i) {
            var apps = [];
            if (role.apps) {
              apps = role.apps;
            }
            var app_names = [];
            apps.map(function(client_id) {
              var app = _.find(this.state.apps, { client_id: client_id });
              if (app) {
                app_names.push(app.name);
              } else {
                app_names.push(client_id);
              }
            }, this);

            return (
              <tr key={role.id}>
                <td>{role.name}</td>
                <td>{role.all_apps === true ? 'Yes' : 'No'}</td>
                <td>
                  <ul className="role-list">
                  {app_names.map(function(app) {
                    return (<li key={app}>{app}</li>);
                  })}
                  </ul>
                </td>
                <td>
                  <BS.ModalTrigger modal={<UI.PromptModal message="Are you sure you want to delete this role?" onAcceptDialog={this.deleteRole.bind(this, role)} />}>
                    <span className="table-button glyphicon glyphicon-trash" aria-hidden="true"></span>
                  </BS.ModalTrigger>
                </td>
                <td>
                  <BS.ModalTrigger modal={<RoleModal apps={this.state.apps} role={role} onRoleSaved={this.saveRole} />}>
                    <span className="table-button glyphicon glyphicon-cog" aria-hidden="true"></span>
                  </BS.ModalTrigger>
                </td>
              </tr>
            );
          }, this)}
          </tbody>
        </table>
      );
    }

    return (
      <div className="container">
        <UI.PageHeader title="Administration: Roles">
          <BS.ModalTrigger modal={<RoleModal apps={this.state.apps} onRoleSaved={this.saveRole} />}>
            <BS.Button bsStyle="primary" className="pull-right">
              <i className="glyphicon glyphicon-plus"></i> New Role
            </BS.Button>
          </BS.ModalTrigger>
        </UI.PageHeader>
        <div className="row">
          {{content}}

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
