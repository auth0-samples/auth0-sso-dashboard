var React = require('react');

module.exports = React.createClass({
  render: function() {
    return(
      <button className={'btn btn-primary ' + this.props.className}>{this.props.children}</button>
    );
  }
});
