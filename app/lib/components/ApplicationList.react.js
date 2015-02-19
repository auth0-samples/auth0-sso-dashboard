var React = require('react');


var ApplicationList = React.createClass({
  render: function() {
    return (
      <div className="container">
        <div className="row page-header">
          <h2>Your Applications</h2>
        </div>
        <div className="row" id="apps">
        </div>
      </div>
    );
  }
});

module.exports = ApplicationList;