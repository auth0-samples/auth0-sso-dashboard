var React = require('react');

var ProfileMenu = React.createClass({
  render: function() {
    return (
      <li className="dropdown">
        <a href="#" className="dropdown-toggle profile-image-dropdown" data-toggle="dropdown">
          <img src="" className="profile-image img-circle" /> <span id="name">displayName</span> <b className="caret"></b>
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
  }

});

module.exports = ProfileMenu;