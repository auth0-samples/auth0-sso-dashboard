var React = require('react');
var ProfileStore = require('../stores/ProfileStore');


function getStateFromStores() {
  return {
    profile: ProfileStore.getProfile()
  };
}

var ProfileMenu = React.createClass({
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
    var displayName = "Login";
    var profileImageUrl = 'https://graph.facebook.com/3/picture';
    if (this.state.profile) {
      displayName = this.state.profile.name;
      profileImageUrl = this.state.profile.picture;
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
          <li><a href="/logout" className="logout"><i className="fa fa-sign-out logout"></i> Logout</a>
          </li>
        </ul>
      </li>
    );
  },

  /**
   * Event handler for 'change' events coming from the stores
   */
  _onChange: function() {
    this.setState(getStateFromStores());
  }

});

module.exports = ProfileMenu;
