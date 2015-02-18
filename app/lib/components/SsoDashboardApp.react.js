var React = require('react');
var Navbar = require('./Navbar.react');

var SsoDashboardApp = React.createClass({
  render: function() {
    return (
      <div>
        <Navbar />
        <div class="container">
        </div>
      </div>
    );
  }
});

module.exports = SsoDashboardApp;
