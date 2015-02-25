var React = require('react');

var SettingAdminSection = React.createClass({
  render: function() {
    return (
      <div className="container">
        <div className="row page-header">
          <h2>Setting Administration</h2>
        </div>
        <div className="row" id="apps">
          Setting Admin
        </div>
      </div>
    );
  }
});

module.exports = SettingAdminSection;
