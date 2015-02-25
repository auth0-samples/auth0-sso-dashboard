var React = require('react');

var UserAdminSection = React.createClass({
  render: function() {
    return (
      <div className="container">
        <div className="row page-header">
          <h2>User Administration</h2>
        </div>
        <div className="row" id="apps">
          User Admin
        </div>
      </div>
    );
  }
});

module.exports = UserAdminSection;
