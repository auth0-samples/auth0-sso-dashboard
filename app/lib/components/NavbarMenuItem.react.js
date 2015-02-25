var React = require('react');
var Router = require('react-router');
var Link = Router.Link;

var NavbarMenuItem = React.createClass({
  render: function() {
    var className;
    var currentPath = Router.HashLocation.getCurrentPath();
    if (currentPath === this.props.route || currentPath.indexOf(this.props.route + '/') === 0) {
      className = "active";
    }
    return (
      <li className={className}><Link to={this.props.route}>{this.props.title}</Link></li>
    );
  }
});

module.exports = NavbarMenuItem;
