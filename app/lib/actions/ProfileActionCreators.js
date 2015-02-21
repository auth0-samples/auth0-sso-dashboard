var AppDispatcher = require('../dispatcher/AppDispatcher');
var AppConstants = require('../constants/AppConstants');

module.exports = {

  /**
   * @param  {string} token
   */
  receiveProfile: function(profile) {
    AppDispatcher.dispatch({
      actionType: AppConstants.RECEIVED_PROFILE,
      profile: profile
    });
  }

};
