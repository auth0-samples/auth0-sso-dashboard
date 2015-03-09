var React = require('react');
var AuthActions = require('../actions/AuthActions');
var Link = require('react-router').Link;

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
          <li><Link to="/account"><i className="glyphicon glyphicon-user logout"></i> Account</Link></li>
          <li className="divider"></li>
          <li><a onClick={this.handleLogout} className="logout"><i className="glyphicon glyphicon-log-out logout"></i> Logout</a>
          </li>
        </ul>
      </li>
    );
  },

  handleLogout: function(event) {
    AuthActions.logout();
  }

});

module.exports = ProfileMenu;
