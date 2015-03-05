var React = require('react');
var DataWebAPIUtils = require('../utils/DataWebAPIUtils');
var RoleStore = require('../stores/RoleStore');
var AppStore = require('../stores/AppStore');
var Mixins = require('../mixins');
var UI = require('./UI.react');

function getStateFromStores() {
  return {
    roles: RoleStore.getAll(),
    apps: AppStore.getAll()
  };
}

var AdminRoles = React.createClass({
  mixins: [Mixins.TokenState],

  getInitialState: function() {
    return getStateFromStores();
  },

  componentDidMount: function() {
    RoleStore.addChangeListener(this._onChange);
    AppStore.addChangeListener(this._onChange);
    if (this.state.token) {
      DataWebAPIUtils.loadRoles(this.state.token);
      DataWebAPIUtils.loadApps(this.state.token);
    }
  },

  componentWillUnmount: function() {
    RoleStore.removeChangeListener(this._onChange);
    AppStore.removeChangeListener(this._onChange);
  },

  handleClick: function(i) {
    var role = this.state.roles[i];
    console.log('edit');
  },

  render: function() {
    return (
      <div className="container">
        <UI.PageHeader title="Administration: Apps">
          <button className="btn btn-primary pull-right" data-toggle="modal" data-target="#role-modal"><i className="glyphicon glyphicon-plus"></i> New Role</button>
          <RoleModal id="role-modal" title="New Role" apps={this.state.apps} />
        </UI.PageHeader>
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
                  <tr key={role.id}>
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

var Forms = require('./Forms.react');

var RoleModal = React.createClass({
  render: function() {
    return(
      <div className="modal fade" id={this.props.id} tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
              <h4 className="modal-title" id="myModalLabel">{this.props.title}</h4>
            </div>
            <div className="modal-body">
              <form className="form-horizontal">
                <Forms.TextInput name="name" label="Name" placeholder="Name" />
                <Forms.Checkbox name="all-apps" label="Allow all apps" />
                <fieldset>
                  <label>Apps</label>
                  {this.props.apps.map(function(app, i) {
                    return <Forms.Checkbox name={'app-' + app.id} label={app.name} />
                  })}
                </fieldset>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
              <button type="button" className="btn btn-primary">Save changes</button>
            </div>
          </div>
        </div>
      </div>
    )
  }
})

module.exports = AdminRoles;
