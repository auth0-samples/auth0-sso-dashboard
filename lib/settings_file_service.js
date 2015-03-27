var fs = require('fs');
var path = require('path');
var _ = require('lodash');
var uuid = require('uuid');
var request = require('request');

var empty_config = {
  settings: {
    title: "Company Dashboard",
    theme_color: null,
    logo_url: null
  },
  roles: [],
  clients: []
};

class SettingsFileService {

  constructor(options) {
    options = options || {};
    this.config = null;
    this.configPath = options.configPath || path.join(__dirname, '../config.json');
  }

  _writeConfig() {
    return new Promise((resolve, reject) => {
      var json = JSON.stringify(this.config, null, 2);
      fs.writeFile(this.configPath, json, function(err) {
        if (err) {
          console.log(err);
          reject(err);
        }
        resolve();
      })
    });
  }

  _ensureLoaded() {
    return new Promise((resolve, reject) => {
      if (!this.config) {
        fs.exists(this.configPath, (function(exists) {
          if (exists) {
            fs.readFile(this.configPath, (function(err, json) {
              if (err) {
                console.log(err);
                reject(err);
              }
              this.config = JSON.parse(json);
              resolve();
            }).bind(this));
          } else if (process.env.CONFIG_URL) {
            request(process.env.CONFIG_URL, (function(error, response, body) {
              console.log(body);
              this.config = JSON.parse(body);
              this._writeConfig()
              .then(function() {
                resolve();
              });
            }).bind(this));
          } else {
            this.config = empty_config;
            this._writeConfig()
            .then(function() {
              resolve();
            });
          }
        }).bind(this));

      } else {
        resolve();
      }
    });
  }

  _getConfig(name) {
    return this._ensureLoaded()
    .then(() => {
      return this.config[name]
    });
  }

  getRoles() {
    return this._getConfig('roles');
  }

  saveRole(role) {
    return this._ensureLoaded()
    .then(() => {
      var i = _.findIndex(this.config.roles, { 'id': role.id });
      if (i > -1) {
        this.config.roles[i] = role;
      } else {
        role.id = uuid.v4()
        this.config.roles.push(role);
      }
    }).then(() => {
      return this._writeConfig();
    }).then(() => {
      return role;
    })
  }

  deleteRole(role_id) {
    return this._ensureLoaded()
    .then(() => {
      var i = _.findIndex(this.config.roles, { 'id': role_id });
      if (i > -1) {
        this.config.roles.splice(i, 1);
      } else {
        throw 'Invalid role_id';
      }
    }).then(() => {
      return this._writeConfig();
    });
  }

  saveClient(client) {
    return this._ensureLoaded()
    .then(() => {
      var i = _.findIndex(this.config.clients, { 'client_id': client.client_id });
      var configClient = {
        client_id: client.client_id,
        logo_url: client.logo_url
      }
      if (i > -1) {
        this.config.clients[i] = configClient;
      } else {
        this.config.clients.push(configClient);
      }
    }).then(() => {
      return this._writeConfig();
    }).then(() => {
      return client;
    });
  }

  getClients() {
    return this._getConfig('clients');
  }

  getSettings() {
    return this._getConfig('settings');
  }

  saveSettings(settings) {
    return this._ensureLoaded()
    .then(() => {
      this.config.settings = settings;
    }).then(() => {
      return this._writeConfig();
    }).then(() => {
      return this.config.settings;
    });
  }
}

module.exports = SettingsFileService;
