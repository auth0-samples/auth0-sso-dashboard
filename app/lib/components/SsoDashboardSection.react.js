var React = require('react');
var UserAppStore = require('../stores/UserAppStore');
var ApplicationListItem = require('./ApplicationListItem.react');
var UI = require('./UI.react');
var AppActions = require('../actions/AppActions');
var _ = require('lodash');

function getStateFromStores() {
  return {
    apps: UserAppStore.get()
  };
}

var ApplicationList = React.createClass({

  getInitialState: function() {
    return getStateFromStores();
  },

  componentDidMount: function() {
    UserAppStore.addChangeListener(this._onChange);
    if (this.props.token) {
      AppActions.loadUserApps(this.props.token);
    }
  },

  componentWillUnmount: function() {
    UserAppStore.removeChangeListener(this._onChange);
  },

  onSearchChange: function(event) {
    this.setState({ searchTerm: event.target.value });
  },

  render: function() {
    var message = "It looks like you haven't been authorized to use any applications yet.";
    var inner = (<h3>{message}</h3>);
    if (this.state.apps && this.state.apps.length > 0) {
      inner = this.state.apps.map(function(app) {
        if (this.state.searchTerm) {
          var tokens = app.name.toLowerCase().split(' ');
          var q = this.state.searchTerm.toLowerCase();
          var include = false;
          tokens.map(function(token) {
            include = include || _.startsWith(token, q);
          });
          if (!include) {
            return;
          }
        }

        return (
          <ApplicationListItem key={app.client_id} app={app} />
        );
      }, this);
    }

    return (
      <div className="container">
        <UI.PageHeader title="Your Applications">
          <div className="search-box">
            <span className="glyphicon glyphicon-search"></span>
            <input type="text" placeholder="Search" onChange={this.onSearchChange} />
          </div>
        </UI.PageHeader>
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
