var EventEmitter = require('events').EventEmitter;
var util = require('util');
//var Immutable = require('immutable');
var _ = require('lodash');

var CHANGE_EVENT = 'change';

var Store = function(initial) {
  EventEmitter.call(this);
  this._data = initial;
};
util.inherits(Store, EventEmitter);

Store.prototype.set = function(data) {
  this._data = data || this._data;
  this.emitChange();
}

Store.prototype.get = function(data) {
  return this._data;
}

Store.prototype.update = function(data, comparison) {
  var i = _.findIndex(this._data, comparison);
  if (i > -1) {
    this._data[i] = data;
  } else {
    this._data.push(data)
  }
  this.emitChange();
}

Store.prototype.emitChange = function() {
  this.emit(CHANGE_EVENT);
};

Store.prototype.addChangeListener = function(callback) {
  this.on(CHANGE_EVENT, callback);
};

Store.prototype.removeChangeListener = function(callback) {
  this.removeListener(CHANGE_EVENT, callback);
};


module.exports = Store;
