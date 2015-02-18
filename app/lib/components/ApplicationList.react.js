var React = require('react');


var ApplicationList = React.createClass({
  render: function() {
    return (
      <div class="row page-header">
        <h2>Your Applications</h2>
      </div>
      <div class="row" id="apps">
      </div>
    );
  }
});
