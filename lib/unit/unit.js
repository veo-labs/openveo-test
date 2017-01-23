'use strict';

/**
 * Exposes a list of modules to help writing server unit tests on OpenVeo using mocha.
 *
 *     require('@openveo/test').ut;
 *
 * @module unit
 * @main unit
 */

module.exports.plugins = process.requireTest('lib/unit/plugins/index.js');
