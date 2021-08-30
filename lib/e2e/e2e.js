'use strict';

/**
 * Exposes a list of modules to help writing end to end tests on OpenVeo using protractor.
 *
 * @example
 * require('@openveo/test').e2e;
 *
 * @module e2e
 * @property {module:e2e/pages} pages pages module
 * @property {module:e2e/asserts} asserts asserts module
 * @property {module:e2e/fields} fields fields module
 * @property {module:e2e/helpers} helpers helpers module
 * @property {module:e2e/plugins} plugins plugins module
 * @property {module:e2e/browser} browser browser module
 * @property {module:e2e/i18n} i18n i18n module
 * @property {Object} users Predefined tests users
 */

module.exports.pages = process.requireTest('lib/e2e/pages/index.js');
module.exports.asserts = process.requireTest('lib/e2e/assertions/index.js');
module.exports.fields = process.requireTest('lib/e2e/fields/index.js');
module.exports.helpers = process.requireTest('lib/e2e/helpers/index.js');
module.exports.plugins = process.requireTest('lib/e2e/plugins/index.js');
module.exports.browser = process.requireTest('lib/e2e/browser.js');
module.exports.i18n = process.requireTest('lib/e2e/i18n.js');
module.exports.users = process.requireTest('lib/e2e/users.json');
