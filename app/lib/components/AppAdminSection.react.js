var React = require('react');

var AppAdminSection = React.createClass({
  render: function() {
    return (
      <div className="container">
        <div className="row page-header">
          <h2>App Administration</h2>
        </div>
        <div className="row" id="apps">
          App Admin
        </div>
      </div>
    );
  }
});

module.exports = AppAdminSection;
