var React = require('react');
var RouterMixin = require('../utils/Router').RouterMixin;


var AdminSettingButton = React.createClass({
  mixins: [RouterMixin],
  render: function() {
    return (
      <div className="app" onClick={this.handleClick}>
        <div className={'icon ' + this.props.icon}></div>
        <a className="name">{this.props.name}</a>
      </div>
    );
  },

  handleClick: function(event) {
    this.navigate(this.props.route);
  }
});

module.exports = AdminSettingButton;
