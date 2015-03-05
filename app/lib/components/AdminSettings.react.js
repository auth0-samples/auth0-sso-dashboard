var React = require('react');
var UI = require('./UI.react');

var AdminSettings = React.createClass({
  render: function() {
    return (
      <div className="container">
        <UI.PageHeader title="Administration: Settings" />
        <div className="row" id="apps">
          Settings Admin
        </div>
      </div>
    );
  }
});

module.exports = AdminSettings;
