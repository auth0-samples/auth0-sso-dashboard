var AppDispatcher = require('../dispatcher/AppDispatcher');
var AppConstants = require('../constants/AppConstants');

module.exports = {

  /**
   * @param  {string} token
   */
  recieveProfile: function(profile) {
    AppDispatcher.dispatch({
      actionType: AppConstants.RECIEVED_PROFILE,
      profile: profile
    });
  }

};
