var React = require('react');
var RouteHandler = require('react-router').RouteHandler;

export default class AdminSection extends React.Component {
  render() {
    return (
      <RouteHandler {...this.props}/>
    );
  }
}
