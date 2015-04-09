var React = require('react');
var NavbarMenuItem = require('./NavbarMenuItem.react');
var Link = require('react-router').Link;
var BS = require('react-bootstrap');

export default class Navbar extends React.Component {

  render() {
    var title = window.config.title;
    var logo_url = window.config.logo_url;

    var brand = title;
    if (logo_url) {
      brand = <span><img src={logo_url} className="brand-image" /> {title}</span>
    }

    var displayName = this.props.token_info.name;
    var profileImageUrl = this.props.token_info.picture || 'https://graph.facebook.com/3/picture';

    var adminMenu;
    if (this.props.token_info.is_admin) {
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

  handleLogout(event) {
    event.preventDefault();
    this.props.logout();
  }
}
