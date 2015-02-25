var AppDispatcher = require('../dispatcher/AppDispatcher');
var AppConstants = require('../constants/AppConstants');

module.exports = {

  /**
   * @param  {array} users
   */
  receiveUsers: function(users) {
    AppDispatcher.dispatch({
      actionType: AppConstants.RECEIVED_USERS,
      users: users
    });
  }

};
