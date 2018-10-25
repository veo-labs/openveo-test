'use strict';

/**
 * @module e2e
 */

var path = require('path');
var browserExt = process.requireTest('lib/e2e/browser.js');
var today = new Date();
var testsId = String(today.getMonth() + 1) + String(today.getDate()) + String(today.getFullYear()) +
    '-' + String(today.getTime());

/**
 * Defines a protractor screenshot plugin to capture an image if a test failed.
 *
 * @example
 *
 *     // In protractor configuration file
 *     plugins: [
 *       {
 *
 *          // Path to the directory which will hold the taken screenshots
 *          outdir: 'build/screenshots',
 *
 *          // Load the plugin
 *          inline: require('@openveo/test').e2e.plugins.screenshotPlugin
 *       }
 *     ]
 *
 * @class screenshotPlugin
 */
var screenshotPlugin = {};
module.exports = screenshotPlugin;

/**
 * Generates a screenshot each time a test failed.
 *
 * For more more information about plugins refer to protractor's documentation available at
 * https://github.com/angular/protractor/blob/master/docs/plugins.md
 */
screenshotPlugin.postTest = function(passed, testInfo) {
  var self = this;
  if (!passed) {
    return browser.getProcessedConfig().then(function(conf) {
      var browserName = conf.capabilities.browserName.toLowerCase().replace(/ /g, '-');
      var category = testInfo.category.replace(/ /g, '-').replace(/["|\\|/]/g, '').toLowerCase();
      var test = testInfo.name.replace(/ /g, '-').replace(/["|\\|/]/g, '').toLowerCase();
      var dir = path.join(self.config.outdir, testsId, browserName, category);
      return browserExt.takeScreenshot(dir, test);
    });
  }
};
