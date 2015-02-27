var TokenStore = require('../stores/TokenStore');


function getStateFromStores() {
  return {
    isAuthenticated: TokenStore.isAuthenticated(),
    token: TokenStore.get()
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
  }
}
