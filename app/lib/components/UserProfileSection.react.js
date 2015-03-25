var React = require('react');
var ProfileStore = require('../stores/ProfileStore');
var UI = require('./UI.react');
var BS = require('react-bootstrap');
var Mixins = require('../mixins');
var UserActions = require('../actions/UserActions');
var MUI = require('material-ui');

function getStateFromStores() {
  return {
    profile: ProfileStore.get()
  };
}

var UserProfile = React.createClass({
  mixins: [Mixins.TokenState],

  getInitialState: function() {
    return getStateFromStores();
  },

  componentDidMount: function() {
    ProfileStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    ProfileStore.removeChangeListener(this._onChange);
  },

  saveChanges: function(user_metadata) {
    UserActions.saveUserProfile(this.state.token, this.state.profile.user_id, user_metadata);
    this.refs.snackbar.show();
    setTimeout((function() {
      this.refs.snackbar.dismiss();
    }).bind(this), 2000)
  },

  render: function() {
    var body;
    if (this.state.profile && this.state.profile.user_metadata) {
      body = <ProfileEditor profile={this.state.profile} onSaveChanges={this.saveChanges} />;
    } else {
      body = "Loading";
    }
    return (
      <div className="container">
        <UI.PageHeader title="User Profile" />
        <MUI.Snackbar ref="snackbar" message="User profile saved." />
        <div className="row">
          {body}
        </div>
      </div>
    )
  },

  /**
   * Event handler for 'change' events coming from the stores
   */
  _onChange: function() {
    this.setState(getStateFromStores());
  }
});


var ProfileEditor = React.createClass({
  getInitialState: function() {
    var user_metadata = {};
    if (this.props.profile.user_metadata) {
      user_metadata = this.props.profile.user_metadata;
    }
    return user_metadata;
  },

  // onEmailChanged: function(event) {
  //   var profile = this.state.profile;
  //   profile.email = event.target.value;
  //   this.setState({profile: profile });
  // },

  onPhoneChanged: function(event) {
    this.setState({ phone: event.target.value });
  },

  saveChanges: function(event) {
    this.props.onSaveChanges(this.state);
  },

  render: function() {
    var profile = this.props.profile;
    return (
      <form>
        <BS.Input type="text" label="Name" value={profile.name} readOnly />
        <BS.Input type="email" label="Email" value={profile.email} readOnly />
        <BS.Input type="phone" label="Phone" value={this.state.phone} placeholder="Phone number" onChange={this.onPhoneChanged} />
        <BS.Button className="btn btn-primary" onClick={this.saveChanges}>Save changes</BS.Button>
      </form>
    )
  }


});


module.exports = UserProfile;
