var Dispatcher = require('../Dispatcher');
var Constants = require('../Constants');
var Store = require('./Store');

var UserStore = new Store([]);

UserStore.setTotalPages = function(limit, total) {
  this.total_pages = Math.ceil(total / limit) - 1;
  this.emitChange();
};

UserStore.getTotalPages = function() {
  return this.total_pages;
};

UserStore.setCurrentPage = function(length, start) {
  this.current_page = Math.floor(start / length) - 1;
}

UserStore.getCurrentPage = function() {
  return this.current_page;
}

// Register callback to handle all updates
Dispatcher.register(function(action) {

  switch(action.actionType) {
    case Constants.RECEIVED_USERS:
      UserStore.set(action.users);
      UserStore.setTotalPages(action.limit, action.total);
      UserStore.setCurrentPage(action.length, action.start);
      break;
    case Constants.USER_LOGGED_OUT:
      UserStore.set();
      break;
    case Constants.SAVED_USER:
      UserStore.update(action.user, function(current) {
        return current.user_id === action.user.user_id;
      });
      break;
    default:
      // no op
  }
});

module.exports = UserStore;
