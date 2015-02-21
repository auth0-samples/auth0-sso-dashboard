var React = require('react');


var ApplicationItem = React.createClass({
  render: function() {
    var app = this.props.app;
    var logoUrl = '/img/logos/auth0.png';
    var loginUrl = 'https://' + config.auth0_domain + '/samlp/' + app.client_id;
    if (app.logo) {
      logoUrl = app.logo;
    }

    return (
      <div className="app">
        <a href={loginUrl}><img src={logoUrl} /></a>
        <a className="name" href={loginUrl}>{app.name}</a>
      </div>
    );
  }
});

module.exports = ApplicationItem;
