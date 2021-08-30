'use strict';

/**
 * Exposes a list of plugins to be used in unit tests.
 *
 * @module unit/plugins
 * @property {module:unit/plugins/inlineTemplatesPreprocessor} inlineTemplatesPreprocessor inlineTemplatesPreprocessor
 * module
 */

module.exports.inlineTemplatesPreprocessor = process.requireTest(
  'lib/unit/plugins/karma-ng-inline-templates-preprocessor/index.js'
);
