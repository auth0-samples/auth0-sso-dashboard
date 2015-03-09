var Dispatcher = require('../Dispatcher');
var Constants = require('../Constants');
var API = require('../API');

module.exports = {

  getUsers: function() {
    API.loadUsers(this.state.token, {
      per_page: 10,
      page: 0
    });
  },

};
