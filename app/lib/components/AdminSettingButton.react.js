var React = require('react');
var Router = require('react-router');


var AdminSettingButton = React.createClass({
  mixins: [ Router.Navigation ],
  render: function() {
    return (
      <div className="app" onClick={this.handleClick}>
        <div className={'icon ' + this.props.icon}></div>
        <a className="name" onClick={this.handleClick}>{this.props.name}</a>
      </div>
    );
  },

  handleClick: function(event) {
    this.transitionTo(this.props.route);
  }
});

module.exports = AdminSettingButton;
