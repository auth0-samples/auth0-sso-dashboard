var React = require('react');
var ProfileStore = require('../stores/ProfileStore');
var UI = require('./UI.react');
var BS = require('react-bootstrap');
var UserActions = require('../actions/UserActions');
var MUI = require('material-ui');

function getStateFromStores() {
  return {
    profile: ProfileStore.get()
  };
}

var UserProfile = React.createClass({

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
    UserActions.saveUserProfile(this.props.token, this.state.profile.user_id, user_metadata);
    this.refs.snackbar.show();
    setTimeout((function() {
      this.refs.snackbar.dismiss();
    }).bind(this), 2000)
  },

  render: function() {
    var body;
    if (this.state.profile) {
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
    return {};
  },

  componentWillReceiveProps: function(nextProps) {
    var user_metadata = {};
    if (nextProps.profile.user_metadata) {
      user_metadata = nextProps.profile.user_metadata;
    }
    this.setState(user_metadata);
  },

  // onEmailChanged: function(event) {
  //   var profile = this.state.profile;
  //   profile.email = event.target.value;
  //   this.setState({profile: profile });
  // },

  onPhoneChanged: function(event) {
    this.setState({ phone: event.target.value });
  },

  onHomeAddressChanged: function(event) {
    this.setState({ home_address: event.target.value });
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
        <BS.Input type='textarea' label="Home Address" ref="homeaddress" value={this.state.home_address} onChange={this.onHomeAddressChanged}/>
        <BS.Button className="btn btn-primary" onClick={this.saveChanges}>Save changes</BS.Button>
      </form>
    )
  },

  componentDidMount: function() {
    var addressPlaceholder = "1234 Example St.\nBellevue, WA 98004";
    var node = this.refs.homeaddress.getDOMNode();
    if (node) {
      node.childNodes[1].setAttribute('placeholder', addressPlaceholder);
    }
  }


});


module.exports = UserProfile;
