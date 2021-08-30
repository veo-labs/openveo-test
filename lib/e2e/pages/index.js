'use strict';

/**
 * Exposes a list of modules to drive pages.
 *
 * @module e2e/pages
 * @property {module:e2e/pages/Page} Page Page module
 * @property {module:e2e/pages/BackEndPage} BackEndPage BackEndPage module
 * @property {module:e2e/pages/TablePage} TablePage TablePage module
 */

module.exports.Page = process.requireTest('lib/e2e/pages/Page.js');
module.exports.BackEndPage = process.requireTest('lib/e2e/pages/BackEndPage.js');
module.exports.TablePage = process.requireTest('lib/e2e/pages/TablePage.js');
