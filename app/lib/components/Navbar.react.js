var React = require('react');

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
              <li className="active"><a>Apps</a>
              </li>
              <li><a href="#">Email</a>
              </li>
              <li><a href="#">Calendar</a>
              </li>
              <li><a href="#">Contacts</a>
              </li>
              <li className="dropdown">
                <a href="#" className="dropdown-toggle profile-image-dropdown" data-toggle="dropdown">
                  <img src="" className="profile-image img-circle" /> <span id="name">displayName</span> <b className="caret"></b>
                </a>
                <ul className="dropdown-menu">
                  <li><a href="#"><i className="fa fa-cog"></i> Account</a>
                  </li>
                  <li className="divider"></li>
                  <li><a href="/logout" className="logout"><i class="fa fa-sign-out logout"></i> Logout</a>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    );
  }
});

module.exports = Navbar;
