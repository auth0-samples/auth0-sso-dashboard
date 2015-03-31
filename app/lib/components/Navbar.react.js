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

export default class Navbar extends React.Component {

  constructor() {
    this.state = getStateFromStores();
  }

  componentDidMount() {
    ProfileStore.addChangeListener(this._onChange.bind(this));
  }

  componentWillUnmount() {
    ProfileStore.removeChangeListener(this._onChange);
  }

  render() {
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
      <BS.Navbar inverse fixedTop brand={brand} toggleNavKey={0}>
        <BS.Nav right eventKey={0}>
          <NavbarMenuItem title="Apps" route="/" />
          {adminMenu}
          <BS.DropdownButton title={profileMenuContent}>
            <NavbarMenuItem title="Profile" route="/profile" />
            <BS.MenuItem eventKey={3} onClick={this.handleLogout.bind(this)}>Logout</BS.MenuItem>
          </BS.DropdownButton>
        </BS.Nav>
      </BS.Navbar>
    );
  }

  /**
   * Event handler for 'change' events coming from the stores
   */
  _onChange() {
    this.setState(getStateFromStores());
  }

  handleLogout(event) {
    event.preventDefault();
    AuthActions.logout();
    this.context.router.transitionTo('/login');
  }
}

Navbar.contextTypes = {
  router: React.PropTypes.func
};
