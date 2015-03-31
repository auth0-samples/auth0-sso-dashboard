var React = require('react');
var Router = require('react-router');


export default class AdminSettingButton extends React.Component {
  render() {
    return (
      <div className="col-md-2">
        <div className="app" onClick={this.handleClick.bind(this)}>
          <div className="mui-paper mui-z-depth-3 mui-rounded icon">
            <span className={'glyphicon ' + this.props.icon}></span>
          </div>
          <a className="name" onClick={this.handleClick.bind(this)}>{this.props.name}</a>
        </div>
      </div>
    );
  }

  handleClick() {
    this.context.router.transitionTo(this.props.route);
  }
}

AdminSettingButton.contextTypes = {
  router: React.PropTypes.func
};
