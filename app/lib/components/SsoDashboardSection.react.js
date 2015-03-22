var React = require('react');
var UserAppStore = require('../stores/UserAppStore');
var ApplicationListItem = require('./ApplicationListItem.react');
var UI = require('./UI.react');
var Mixins = require('../mixins');
var AppActions = require('../actions/AppActions');

function getStateFromStores() {
  return {
    apps: UserAppStore.get()
  };
}

function getAppListItem(app) {
  return (
    <ApplicationListItem
      key={app.client_id}
      app={app}
    />
  );
}

var ApplicationList = React.createClass({
  mixins: [Mixins.TokenState],

  getInitialState: function() {
    return getStateFromStores();
  },

  componentDidMount: function() {
    UserAppStore.addChangeListener(this._onChange);
    if (this.state.token) {
      AppActions.loadUserApps(this.state.token);
    }
  },

  componentWillUnmount: function() {
    UserAppStore.removeChangeListener(this._onChange);
  },

  render: function() {
    var message = "It looks like you haven't been authorized to use any applications yet.";
    var inner = (<h3>{message}</h3>);
    if (this.state.apps && this.state.apps.length > 0) {
      inner = this.state.apps.map(getAppListItem);
    }
    return (
      <div className="container">
        <UI.PageHeader title="Your Applications" />
        <div className="row" id="apps">
          {inner}
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

module.exports = ApplicationList;
