var React = require('react');
var AppStore = require('../stores/AppStore');
var Mixins = require('../mixins');
var UI = require('./UI.react');
var AppActionCreators = require('../Actions/AppActionCreators');

function getStateFromStores() {
  return {
    apps: AppStore.get()
  };
}

var AdminApps = React.createClass({
  mixins: [Mixins.TokenState],

  getInitialState: function() {
    return getStateFromStores();
  },

  componentDidMount: function() {
    AppStore.addChangeListener(this._onChange);
    if (this.state.token) {
      AppActionCreators.getApps(this.state.token);
    }
  },

  componentWillUnmount: function() {
    AppStore.removeChangeListener(this._onChange);
  },

  handleClick: function(i) {
    var role = this.state.roles[i];
    console.log('edit');
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
                <td>Roles</td>
                <td width="20px"></td>
              </tr>
            </thead>
            <tbody>
              {this.state.apps.map(function(app, i) {
                var boundClick = this.handleClick.bind(this, i);
                return (
                  <tr key={app.client_id}>
                    <td>{app.name}</td>
                    <td></td>
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

module.exports = AdminApps;
