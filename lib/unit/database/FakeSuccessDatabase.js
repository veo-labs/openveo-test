'use strict';

var util = require('util');
var openVeoAPI = require('@openveo/api');
var Database = openVeoAPI.Database;

function FakeSuccessDatabase() {
}

module.exports = FakeSuccessDatabase;
util.inherits(FakeSuccessDatabase, Database);

FakeSuccessDatabase.prototype.get = function(collection, criteria, projection, limit, callback) {
  var id = 1;
  if (criteria && criteria.id) {
    if (criteria.id.$in) id = criteria.id.$in;
    else id = criteria.id;
  }
  callback(null, [{
    id: id
  }]);
};

FakeSuccessDatabase.prototype.insert = function(collection, data, callback) {
  callback(null, (Array.isArray(data) ? data.length : 1), (Array.isArray(data) ? data : [data]));
};

FakeSuccessDatabase.prototype.update = function(collection, criteria, data, callback) {
  callback(null);
};

FakeSuccessDatabase.prototype.remove = function(collection, filter, callback) {
  callback(null, 1);
};
