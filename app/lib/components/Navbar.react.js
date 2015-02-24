var React = require('react');
var ProfileMenu = require('./ProfileMenu.react');

var Navbar = React.createClass({
  render: function() {
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
            <a className="navbar-brand" href="/">Company Dashboard</a>
          </div>
          <div id="navbar" className="navbar-collapse collapse">
            <ul id="navbar-menu" className="nav navbar-nav navbar-right">
              <li className="active"><a>Apps</a></li>
              <li><a href="#">Admin</a></li>
              <ProfileMenu profile={this.props.profile} />
            </ul>
          </div>
        </div>
      </nav>
    );
  }
});

module.exports = Navbar;
