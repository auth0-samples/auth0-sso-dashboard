var API = require('../API');

module.exports = {
  loadApps: function(proxy_token, aws_credentials) {
    API.loadApps(proxy_token, aws_credentials);
  },

  save: function(aws_credentials, app) {
    API.saveApp(aws_credentials, app);
  },

  loadUserApps: function(task_token) {
    API.loadUserApps(task_token);
  }
};
