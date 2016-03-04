'use strict';

module.exports.pages = process.requireTest('lib/e2e/pages/index.js');
module.exports.asserts = process.requireTest('lib/e2e/assertions/index.js');
module.exports.fields = process.requireTest('lib/e2e/fields/index.js');
module.exports.helpers = process.requireTest('lib/e2e/helpers/index.js');
module.exports.plugins = process.requireTest('lib/e2e/plugins/index.js');
module.exports.browser = process.requireTest('lib/e2e/browser.js');
module.exports.i18n = process.requireTest('lib/e2e/i18n.js');
module.exports.users = process.requireTest('lib/e2e/users.json');
