var React = require('react');
var UI = require('./UI.react');
var BS = require('react-bootstrap');
var SettingsStore = require('../stores/SettingsStore');
var SettingsActions = require('../actions/SettingsActions');
var MUI = require('material-ui');

function getStateFromStores() {
  return {
    settings: SettingsStore.get()
  };
}

var AdminSettings = React.createClass({

  getInitialState: function() {
    return getStateFromStores();
  },

  componentDidMount: function() {
    SettingsStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    SettingsStore.removeChangeListener(this._onChange);
  },

  saveChanges: function(settings) {
    SettingsActions.saveSettings(this.props.token, settings);
    this.refs.snackbar.show();
  },

  handleAction: function() {
    window.location.reload();
  },

  render: function() {
    var body;
    if (this.state.settings) {
      body = <SettingsEditor settings={this.state.settings} onSaveChanges={this.saveChanges} />;
    } else {
      body = "Loading...";
    }
    return (
      <div className="container">
        <UI.PageHeader title="Administration: Settings" />
        <MUI.Snackbar ref="snackbar" message="Settings saved. You must reload the page for them to take effect." action="Reload"  onActionTouchTap={this.handleAction} />
        <div className="row">
          {body}
        </div>
      </div>
    )
  },

  /**
   * Event handler for 'change' events coming from the stores
   */
  _onChange: function() {
    this.setState(getStateFromStores());
  }
});


var SettingsEditor = React.createClass({
  getInitialState: function() {
    return this.props.settings;
  },

  onTitleChanged: function(event) {
    this.setState({ title: event.target.value });
  },

  onThemeColorChanged: function(event) {
    this.setState({ theme_color: event.target.value });
  },

  onLogoChanged: function(event) {
    this.setState({ logo_url: event.target.value });
  },

  saveChanges: function(event) {
    this.props.onSaveChanges(this.state);
  },

  render: function() {
    return (
      <form>
        <BS.Input type="text" label="Title" value={this.state.title} placeholder="Company Dashboard" onChange={this.onTitleChanged} />
        <BS.Input type="text" label="Theme Color" value={this.state.theme_color} placeholder="#2196f3" onChange={this.onThemeColorChanged} />
        <BS.Input type="text" label="Logo URL" value={this.state.logo_url} placeholder="//example.com/logo.png" onChange={this.onLogoChanged} />
        <BS.Button className="btn btn-primary" onClick={this.saveChanges}>Save changes</BS.Button>
      </form>
    )
  }


});

module.exports = AdminSettings;
