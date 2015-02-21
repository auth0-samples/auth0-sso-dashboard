var React = require('react');


var ApplicationItem = React.createClass({
  render: function() {
    var app = this.props.app;
    var logoUrl = '/img/logos/auth0.png';
    var loginUrl = 'https://example.com';
    if (app.logo) {
      logoUrl = app.logo;
    }

    return (
      <div className="app">
        <a href={loginUrl}><img src={logoUrl} /></a>
        <a class="name" href="loginUrl">{app.name}</a>
      </div>
    );
  }
});

module.exports = ApplicationItem;
