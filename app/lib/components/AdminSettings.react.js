var React = require('react');

var AdminSettings = React.createClass({
  render: function() {
    return (
      <div className="container">
        <div className="row page-header">
          <h2>Administration: Settings</h2>
        </div>
        <div className="row" id="apps">
          Settings Admin
        </div>
      </div>
    );
  }
});

module.exports = AdminSettings;
