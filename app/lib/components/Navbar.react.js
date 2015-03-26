var React = require('react');
var NavbarMenuItem = require('./NavbarMenuItem.react');
var Link = require('react-router').Link;
var BS = require('react-bootstrap');
var AuthActions = require('../actions/AuthActions');
var ProfileStore = require('../stores/ProfileStore');
var Router = require('react-router');

function getStateFromStores() {
  return {
    profile: ProfileStore.get(),
  };
}

var Navbar = React.createClass({
  mixins : [ Router.Navigation, Router.State ],

  getInitialState: function() {
    return getStateFromStores();
  },

  componentDidMount: function() {
    ProfileStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    ProfileStore.removeChangeListener(this._onChange);
  },

  render: function() {
    var title = window.config.title;
    var logo_url = window.config.logo_url;

    var brand = title;
    if (logo_url) {
      brand = <span><img src={logo_url} className="brand-image" /> {title}</span>
    }


    var displayName = "Login";
    var profileImageUrl = 'https://graph.facebook.com/3/picture';
    if (this.state.profile) {
      displayName = this.state.profile.name;
      profileImageUrl = this.state.profile.picture;
    }

    var adminMenu;
    if (this.state.profile.is_admin) {
      adminMenu = (<NavbarMenuItem title="Admin" route="/admin" />);
    }

    var profileMenuContent = (
      <span><img src={profileImageUrl} className="profile-image img-circle" /> {displayName}</span>
    );

    return (
      <BS.Navbar className="navbar navbar-inverse navbar-fixed-top" brand={brand}>
        <BS.Nav right>
          <NavbarMenuItem title="Apps" route="/" />
          {adminMenu}
          <BS.DropdownButton title={profileMenuContent}>
            <NavbarMenuItem title="Profile" route="/profile" />
            <BS.MenuItem onClick={this.handleLogout}>Logout</BS.MenuItem>
          </BS.DropdownButton>
        </BS.Nav>
      </BS.Navbar>
    );
  },

  /**
   * Event handler for 'change' events coming from the stores
   */
  _onChange: function() {
    this.setState(getStateFromStores());
  },

  handleLogout: function(event) {
    event.preventDefault();
    AuthActions.logout();
    this.transitionTo('/login');
  }
});

module.exports = Navbar;
