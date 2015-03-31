var React = require('react');
var AppStore = require('../stores/AppStore');
var UI = require('./UI.react');
var AppActions = require('../actions/AppActions');
var BS = require('react-bootstrap');

function getStateFromStores() {
  return {
    apps: AppStore.get()
  };
}

var AdminApps = React.createClass({

  getInitialState: function() {
    return getStateFromStores();
  },

  componentDidMount: function() {
    AppStore.addChangeListener(this._onChange);
    if (this.props.token) {
      AppActions.getApps(this.props.token);
    }
  },

  componentWillUnmount: function() {
    AppStore.removeChangeListener(this._onChange);
  },

  saveApp: function(app) {
    AppActions.save(this.props.token, app);
  },

  render: function() {
    return (
      <div className="container">
        <UI.PageHeader title="Administration: Apps" />
        <div className="row" id="apps">
          <table className="table">
            <thead>
              <tr>
                <td>Name</td>
                <td>Logo</td>
                <td width="20px"></td>
              </tr>
            </thead>
            <tbody>
              {this.state.apps.map(function(app, i) {
                return (
                  <tr key={app.client_id}>
                    <td>{app.name}</td>
                    <td>{app.logo_url}</td>
                    <td>
                      <BS.ModalTrigger modal={<AppModal app={app} roles={this.state.roles} onAppSaved={this.saveApp} />}>
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

var AppModal = React.createClass({
  getInitialState: function() {
    var app = this.props.app || {};
    return {
      logo_url: app.logo_url
    };
  },


  render: function() {

    return(
      <BS.Modal {...this.props} animation={false} title="Edit App">
        <div className="modal-body">
          <form className="form-horizontal">
            <Forms.TextInput name="name" label="Name" placeholder="Name" value={this.props.app.name} disabled="true" />
            <Forms.TextInput name="logo_url" label="Logo" placeholder="/img/logos/logo.png" value={this.state.logo_url} onChange={this.onLogoUrlChanged} />
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
    var app = this.props.app;
    app.logo_url = this.state.logo_url;
    this.props.onAppSaved(app);
    this.props.onRequestHide();
  },

  onLogoUrlChanged: function(event) {
    this.setState({logo_url: event.target.value });
  }

});


module.exports = AdminApps;
