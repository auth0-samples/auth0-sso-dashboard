var TokenStore = require('../stores/TokenStore');


function getStateFromStores() {
  var tokens = TokenStore.get();
  var token, access_token;
  if (tokens) {
    token = tokens.token;
    access_token = tokens.access_token
  }
  return {
    isAuthenticated: TokenStore.isAuthenticated(),
    token: token,
    access_token: access_token
  };
}

module.exports  = {
  getInitialState: function() {
    return getStateFromStores();
  },

  componentDidMount: function() {
    TokenStore.addChangeListener(this._onTokenChange);
  },

  componentWillUnmount: function() {
    TokenStore.removeChangeListener(this._onTokenChange);
  },

  /**
   * Event handler for 'change' events coming from the stores
   */
  _onTokenChange: function() {
    this.setState(getStateFromStores());
  },

  statics: {
    willTransitionTo: function (transition) {
      var nextPath = transition.path;
      if (!TokenStore.isAuthenticated()) {
        transition.redirect('/login',{},
          { 'nextPath' : nextPath });
      }
    }
  }
}
