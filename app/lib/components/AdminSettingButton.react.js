var React = require('react');
var Router = require('react-router');


var AdminSettingButton = React.createClass({
  mixins: [ Router.Navigation ],
  render: function() {
    return (
      <div className="app" onClick={this.handleClick}>
        <div className="mui-paper mui-z-depth-3 mui-rounded icon">
          <span className={'glyphicon ' + this.props.icon}></span>
        </div>
        <a className="name" onClick={this.handleClick}>{this.props.name}</a>
      </div>
    );
  },

  handleClick: function(event) {
    this.transitionTo(this.props.route);
  }
});

module.exports = AdminSettingButton;
