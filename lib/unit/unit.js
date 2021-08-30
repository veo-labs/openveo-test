'use strict';

/**
 * Exposes a list of modules to help writing server unit tests on OpenVeo using mocha.
 *
 * @example
 * require('@openveo/test').ut;
 *
 * @module unit
 * @property {module:unit/plugins} plugins plugins module
 */

module.exports.plugins = process.requireTest('lib/unit/plugins/index.js');
