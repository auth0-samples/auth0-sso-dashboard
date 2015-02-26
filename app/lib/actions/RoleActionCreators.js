var AppDispatcher = require('../dispatcher/AppDispatcher');
var AppConstants = require('../constants/AppConstants');

module.exports = {

  /**
   * @param  {array} roles
   */
  receiveRoles: function(roles) {
    AppDispatcher.dispatch({
      actionType: AppConstants.RECEIVED_ROLES,
      roles: roles
    });
  }

};
