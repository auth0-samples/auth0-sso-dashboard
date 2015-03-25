var React = require('react');
var NavbarMenuItem = require('./NavbarMenuItem.react');
var Link = require('react-router').Link;
var BS = require('react-bootstrap');
var AuthActions = require('../actions/AuthActions');

var Navbar = React.createClass({
  render: function() {
    var title = window.config.title;
    var logo_url = window.config.logo_url;

    var brand = title;
    if (logo_url) {
      brand = <span><img src={logo_url} className="brand-image" /> {title}</span>
    }


    var displayName = "Login";
    var profileImageUrl = 'https://graph.facebook.com/3/picture';
    if (this.props.profile) {
      displayName = this.props.profile.name;
      profileImageUrl = this.props.profile.picture;
    }

    var profileMenuContent = (
      <span><img src={profileImageUrl} className="profile-image img-circle" /> {displayName}</span>
    );

    return (
      <BS.Navbar className="navbar navbar-inverse navbar-fixed-top" brand={brand}>
        <BS.Nav right>
          <NavbarMenuItem title="Apps" route="/" />
          <NavbarMenuItem title="Admin" route="/admin" />
          <BS.DropdownButton title={profileMenuContent}>
            <NavbarMenuItem title="Profile" route="/profile" />
            <BS.MenuItem onClick={this.handleLogout}>Logout</BS.MenuItem>
          </BS.DropdownButton>
        </BS.Nav>
      </BS.Navbar>
    );
  },

  handleLogout: function(event) {
    AuthActions.logout();
  }
});

module.exports = Navbar;
