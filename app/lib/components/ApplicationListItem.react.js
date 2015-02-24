var React = require('react');


var ApplicationItem = React.createClass({
  render: function() {
    var app = this.props.app;

    return (
      <div className="app">
        <a href={app.login_url}><img src={app.logo_url} /></a>
        <a className="name" href={app.login_url}>{app.name}</a>
      </div>
    );
  }
});

module.exports = ApplicationItem;
