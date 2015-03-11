var fs      = require('fs');
var path    = require('path');
var assert  = require('assert');

var configSourcePath = path.join(__dirname, '../config.sample.json');
var configPath = path.join(__dirname, './test.config.json');
var SettingsFileService = require('../lib/settings_file_service');
var service = new SettingsFileService({ configPath: configPath });

describe('settings_file_service', function(){
  beforeEach(function() {
    var json = fs.readFileSync(configSourcePath);
    fs.writeFileSync(configPath, json);
  })

  afterEach(function() {
    if (fs.existsSync(configPath)) {
      fs.unlinkSync(configPath);
    }
  })

  describe('#getConfig', function() {
    it('should return correct value for simple value', function(){
      return service.getConfig('auth0_domain')
      .then((value) => {
        assert.equal(value, 'your-domain.auth0.com');
      });
    });
  })

  describe('#setConfig', function() {
    it('should save simple value', function() {
      return service.getConfig('new_setting')
      .then((value) => {
        assert.equal(value, undefined);
      })
      .then(() => {
        return service.setConfig('new_setting', 1)
      })
      .then(() => {
        return service.getConfig('new_setting');
      }).then((result) => {
        assert.equal(result, 1);
      });
    });
  });

  describe('#saveRole', function() {
    it('should save single role', function() {
      var role = {
        name: 'new_role',
        all_apps: true
      }
      return service.saveRole(role)
      .then((result) => {
        assert.equal(result.id, 4);
      });

    });
  });

  // it('should foo', function(){
  //
  // })
  //
  // it('should bar', function(){
  //
  // })
})
