var _ = require('lodash');
var uuid = require('uuid');
var AWS = require('aws-sdk');
var s3 = new AWS.S3({ params: { Bucket: process.env.AWS_S3_BUCKET }});
s3.config.credentials = new AWS.Credentials(
  process.env.AWS_ACCESS_KEY_ID,
  process.env.AWS_SECRET_ACCESS_KEY
);

const rolesFile = 'data/roles.json';
const clientsFile = 'data/clients.json';

// Initialize data files
[rolesFile, clientsFile]
.map(function(obj) {
  var params = {
    Key: obj
  };
  s3.getObject(params, function(err) {
    if (err) {
      params.Body = '[]';
      params.ContentType = 'application/json';
      s3.putObject(params, function(err) {
        if (err) {
          console.log(err);
        } else {
          console.log('Uplaoded ' + obj);
        }
      });
    } else {
      console.log('Data file \'' + obj + '\' exists, no changes made.');
    }
  });
});

class DataService {

  getRoles() {
    return this._getData(rolesFile);
  }

  saveRole(role) {
    return this.getRoles()
    .then((roles) => {
      var i = _.findIndex(roles, { 'id': role.id });
      if (i > -1) {
        roles[i] = role;
      } else {
        role.id = uuid.v4();
        roles.push(role);
      }
      return roles;
    }).then((roles) => {
      return this._saveData(rolesFile, roles);
    }).then(() => {
      return role;
    });
  }

  deleteRole(role_id) {
    return this.getRoles()
    .then((roles) => {
      var i = _.findIndex(roles, { 'id': role_id });
      if (i > -1) {
        roles.splice(i, 1);
      } else {
        throw 'Invalid role_id';
      }
      return roles;
    }).then((roles) => {
      return this._saveData(rolesFile, roles);
    });
  }

  saveClient(client) {
    return this.getClients()
    .then((clients) => {
      var i = _.findIndex(clients, { 'client_id': client.client_id });
      var configClient = {
        client_id: client.client_id,
        logo_url: client.logo_url
      };
      if (i > -1) {
        clients[i] = configClient;
      } else {
        clients.push(configClient);
      }
      return clients;
    }).then((clients) => {
      return this._saveData(clientsFile, clients);
    }).then(() => {
      return client;
    });
  }

  getClients() {
    return this._getData(clientsFile);
  }

  _getData(key) {
    var params = {
      Key: key
    };
    return new Promise((resolve, reject) => {
      s3.getObject(params, (err, response) => {
        if (err) { return reject(err); }
        var data = JSON.parse(response.Body.toString());
        resolve(data);
      });
    });
  }

  _saveData(key, data) {
    var params = {
      Key: key,
      Body: JSON.stringify(data),
      ContentType: 'application/json'
    };
    return new Promise((resolve, reject) => {
      s3.putObject(params, (err) => {
        if (err) { return reject(err); }
        resolve(data);
      });
    });
  }


}

module.exports = new DataService();
