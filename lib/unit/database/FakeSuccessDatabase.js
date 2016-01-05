'use strict';

var util = require('util');
var openVeoAPI = require('@openveo/api');
var Database = openVeoAPI.Database;

function FakeSuccessDatabase() {
}

module.exports = FakeSuccessDatabase;
util.inherits(FakeSuccessDatabase, Database);

FakeSuccessDatabase.prototype.get = function(collection, criteria, projection, limit, callback) {
  callback(null, [{
    state: 7,
    files: []
  }]);
};

FakeSuccessDatabase.prototype.insert = function(collection, data, callback) {
  callback(null);
};

FakeSuccessDatabase.prototype.update = function(collection, criteria, data, callback) {
  callback(null);
};

FakeSuccessDatabase.prototype.remove = function(collection, criteria, callback) {
  callback(null);
};
