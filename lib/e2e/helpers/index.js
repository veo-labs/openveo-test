'use strict';

/**
 * Exposes a list of modules to help manipulate the database without interacting with the browser.
 *
 * @module e2e/helpers
 * @property {module:e2e/helpers/Helper} Helper Helper module
 */

module.exports.Helper = process.requireTest('lib/e2e/helpers/Helper.js');
