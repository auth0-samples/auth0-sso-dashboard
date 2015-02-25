var React = require('react');

var AdminApps = React.createClass({
  render: function() {
    return (
      <div className="container">
        <div className="row page-header">
          <h2>Administration: Apps</h2>
        </div>
        <div className="row" id="apps">
          App Admin
        </div>
      </div>
    );
  }
});

module.exports = AdminApps;
