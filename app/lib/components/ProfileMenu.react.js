var React = require('react');
var AuthActionCreators = require('../actions/AuthActionCreators');

var ProfileMenu = React.createClass({
  render: function() {
    var displayName = "Login";
    var profileImageUrl = 'https://graph.facebook.com/3/picture';
    if (this.props.profile) {
      displayName = this.props.profile.name;
      profileImageUrl = this.props.profile.picture;
    }

    return (
      <li className="dropdown">
        <a href="#" className="dropdown-toggle profile-image-dropdown" data-toggle="dropdown">
          <img src={profileImageUrl} className="profile-image img-circle" /> <span id="name">{displayName}</span> <b className="caret"></b>
        </a>
        <ul className="dropdown-menu">
          <li><a href="#"><i className="fa fa-cog"></i> Account</a>
          </li>
          <li className="divider"></li>
          <li><a onClick={this.handleLogout} className="logout"><i className="fa fa-sign-out logout"></i> Logout</a>
          </li>
        </ul>
      </li>
    );
  },

  handleLogout: function(event) {
    AuthActionCreators.logout();
  }

});

module.exports = ProfileMenu;
