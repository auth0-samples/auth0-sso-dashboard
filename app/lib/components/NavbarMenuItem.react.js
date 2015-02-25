var React = require('react');
var Router = require('../utils/Router').RouterMixin;

var NavbarMenuItem = React.createClass({
  mixins: [Router],
  render: function() {
    var className;
    if (this.state.currentRoute === this.props.route || this.state.currentRoute.indexOf(this.props.route + '/') === 0) {
      className = "active";
    }
    return (
      <li className={className}><a onClick={this.handleClick}>{this.props.title}</a></li>
    );
  },

  handleClick: function(event) {
    this.navigate(this.props.route);
  }
});

module.exports = NavbarMenuItem;
