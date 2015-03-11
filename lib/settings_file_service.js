var fs = require('fs');
var path = require('path');
var _ = require('lodash');

class SettingsFileService {

  constructor(options) {
    options = options || {};
    this.config = null;
    this.configPath = options.configPath || path.join(__dirname, '../config.json');
  }

  _writeConfig() {
    return new Promise((resolve, reject) => {
      fs.writeFile(this.configPath, this.config, function(err) {
        if (err) reject(err);
        resolve();
      })
    });
  }

  _ensureLoaded() {
    return new Promise((resolve, reject) => {
      if (!this.config) {
        fs.readFile(this.configPath, (function(err, json) {
          if (err) reject(err);
          this.config = JSON.parse(json);
          resolve();
        }).bind(this));
      } else {
        resolve();
      }
    });
  }

  getConfig(name) {
    return this._ensureLoaded()
    .then(() => {
      return this.config[name]
    });
  }

  setConfig(name, value, callback) {
    return this._ensureLoaded().then(() => {
      this.config[name] = value;
      return this.writeConfig();
    });
  }

  getRoles() {
    return this.getConfig('roles');
  }

  saveRole(role) {
    return this._ensureLoaded()
    .then(() => {
      var i = _.findIndex(this.config.roles, { 'id': role.id });
      if (i > -1) {
        this.config.roles[i] = role;
      } else {
        var maxRole = _.max(this.config.roles, function(role) {
          return role.id;
        });
        role.id = maxRole.id + 1;
        this.config.roles.push(role);
      }
    }).then(() => {
      return this._writeConfig();
    }).then(() => {
      return role;
    })
  }

  saveClient(client) {
    return this._ensureLoaded()
    .then(() => {
      var i = _.findIndex(this.config.clients, { 'client_id': client.client_id });
      if (i < 0) {
        throw 'invalid client_id';
      }
      this.config.clients[i] = client;
    }).then(() => {
      return this._writeConfig();
    }).then(() => {
      return client;
    });
  }

  getClients(callback) {
    return this.getConfig('clients');
  }
}

module.exports = SettingsFileService;
