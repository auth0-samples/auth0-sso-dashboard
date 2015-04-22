var React = require('react');
var Router = require('react-router');

export default React.createClass({
  render: function() {
    return (<Router.RouteHandler {...this.props} />);
  }
});
