var React = require('react');

var AdminSection = React.createClass({
  render: function() {
    return (
      <div className="container">
        <div className="row page-header">
          <h2>Administration</h2>
        </div>
        <div className="row" id="apps">
          Admin area...
        </div>
      </div>
    );
  }
});

module.exports = AdminSection;
