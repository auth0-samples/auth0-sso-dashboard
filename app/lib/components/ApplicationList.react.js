var React = require('react');
var AppStore = require('../stores/AppStore');
var ApplicationListItem = require('./ApplicationListItem.react');

function getStateFromStores() {
  return {
    apps: AppStore.getAll()
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
  getInitialState: function() {
    return getStateFromStores();
  },

  componentDidMount: function() {
    AppStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    AppStore.removeChangeListener(this._onChange);
  },

  render: function() {
    var message = "It looks like you haven't been authorized to use any applications yet.";
    var inner = (<h3>{message}</h3>);
    if (this.state.apps && this.state.apps.length > 0) {
      inner = this.state.apps.map(getAppListItem);
    }
    return (
      <div className="container">
        <div className="row page-header">
          <h2>Your Applications</h2>
        </div>
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
