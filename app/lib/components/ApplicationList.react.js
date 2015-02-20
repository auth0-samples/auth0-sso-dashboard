var React = require('react');


var ApplicationList = React.createClass({
  render: function() {
    var message = "It looks like you haven't been authorized to use any applications yet.";
    var inner = (<h3>{message}</h3>);
    return (
      <div className="container">
        <div className="row page-header">
          <h2>Your Applications</h2>
        </div>
        <div className="row" id="apps">
          {inner}
        </div>
      </div>
    );
  }
});

module.exports = ApplicationList;
