'use strict';

/**
 * Exposes a list of Protractor plugins.
 *
 * @module e2e/plugins
 * @property {module:e2e/plugins/screenshotPlugin} screenshotPlugin screenshotPlugin module
 */

module.exports.screenshotPlugin = process.requireTest('lib/e2e/plugins/screenshotPlugin.js');
