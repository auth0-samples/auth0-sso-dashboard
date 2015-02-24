var React = require('react');
var Router = require('../utils/Router');

function getStateFromStores() {
  return {
    currentRoute: Router.getRoute()
  }
}

var NavbarMenuItem = React.createClass({
  getInitialState: function() {
    return getStateFromStores();
  },

  componentDidMount: function() {
    Router.addNavigatedListener(this._onChange);
  },

  componentWillUnmount: function() {
    Router.removeNavigatedListener(this._onChange);
  },

  render: function() {
    var className;
    if (this.props.route === this.state.currentRoute) {
      className = "active";
    }
    return (
      <li className={className}><a onClick={this.handleClick}>{this.props.title}</a></li>
    );
  },

  handleClick: function(event) {
    Router.navigate(this.props.route);
  },

  _onChange: function() {
    this.setState(getStateFromStores());
  }
});

module.exports = NavbarMenuItem;
