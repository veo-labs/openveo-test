'use strict';

/**
 * Provides functions to interact with the file system as an extension to the Node.js filesystem module.
 *
 * @module unit
 * @class generator
 */

// Module dependencies
var openVeoAPI = require('@openveo/api');
var applicationStorage = openVeoAPI.applicationStorage;

/**
 * Generates and set up a database which always succeed.
 *
 * @example
 *
 *     var ut = require('@openveo/test').unit.generator;
 *     ut.generateSuccessDatabase();
 *
 * @method generateSuccessDatabase
 */
module.exports.generateSuccessDatabase = function() {
  var FakeSuccessDatabase = process.requireTest('lib/unit/database/FakeSuccessDatabase.js');
  applicationStorage.setDatabase(new FakeSuccessDatabase());
};

/**
 * Generates and set up a database which always fails.
 *
 * @example
 *
 *     var ut = require('@openveo/test').unit.generator;
 *     ut.generateFailDatabase();
 *
 * @method generateFailDatabase
 */
module.exports.generateFailDatabase = function() {
  var FakeFailDatabase = process.requireTest('lib/unit/database/FakeFailDatabase.js');
  applicationStorage.setDatabase(new FakeFailDatabase());
};

/**
 * Generates fake web service scopes into application storage.
 *
 * @example
 *
 *     var ut = require('@openveo/test').unit.generator;
 *     ut.generateWebServiceScopes();
 *
 * @method generateWebServiceScopes
 */
module.exports.generateWebServiceScopes = function() {
  applicationStorage.setWebServiceScopes(
    {
      scope1: {
        name: 'name 1',
        description: 'description 1',
        paths: ['/ws/videos']
      },
      scope2: {
        name: 'name 2',
        description: 'description 2',
        paths: []
      }
    }
  );
};

/**
 * Generates fake permissions into application storage.
 *
 * @example
 *
 *     var ut = require('@openveo/test').unit.generator;
 *     ut.generatePermissions();
 *
 * @method generatePermissions
 */
module.exports.generatePermissions = function() {
  applicationStorage.setPermissions(
    [
      {
        id: 'perm1',
        name: 'name 1',
        description: 'description 1',
        paths: [
          'get /crud/application'
        ]
      },
      {
        id: 'perm2',
        name: 'name 2',
        description: 'description 2',
        paths: [
          'put /crud/application'
        ]
      }
    ]
  );
};
