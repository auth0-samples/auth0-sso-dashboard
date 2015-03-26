var React = require('react');
var RouteHandler = require('react-router').RouteHandler;
var Mixins = require('../mixins');

var AdminSection = React.createClass({
  mixins: [Mixins.TokenState],
  
  render: function() {
    return (
      <RouteHandler/>
    );
  }
});

module.exports = AdminSection;
