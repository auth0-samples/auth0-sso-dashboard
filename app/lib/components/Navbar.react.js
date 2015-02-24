var React = require('react');
var ProfileMenu = require('./ProfileMenu.react');
var NavbarMenuItem = require('./NavbarMenuItem.react');

var Navbar = React.createClass({
  render: function() {
    var title = window.config.app_title;

    return (
      <nav className="navbar navbar-inverse navbar-fixed-top" role="navigation">
        <div className="container-fluid">
          <div className="navbar-header">
            <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
              <span className="sr-only">Toggle navigation</span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
            </button>
            <a className="navbar-brand" href="/">{title}</a>
          </div>
          <div id="navbar" className="navbar-collapse collapse">
            <ul id="navbar-menu" className="nav navbar-nav navbar-right">
              <NavbarMenuItem title="Apps" route="/" />
              <NavbarMenuItem title="Admin" route="/admin" />
              <ProfileMenu profile={this.props.profile} />
            </ul>
          </div>
        </div>
      </nav>
    );
  }
});

module.exports = Navbar;
