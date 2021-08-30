'use strict';

/**
 * Defines an inline template preprocessor.
 *
 * @example
 * // Configuration example to put in your karma configuration file
 * {
 *   moduleName: 'my-inline-templates' // Name of the AngularJS module that will be created to hold templates
 * }
 *
 * @example
 * // Don't forget to load the module before executing your tests
 * beforeEach(function() {
 *   module('my-inline-templates');
 * });
 *
 * @module unit/plugins/inlineTemplatesPreprocessor
 */

var htmlparser = require('htmlparser2');

/**
 * Builds the Karma plugin.
 *
 * @param {Object} logger Karma logger
 * @param {Object} config Inline templates preprocessor configuration
 * @return {Function} Preprocessor function to call for each file
 */
var inlineTemplatesProcessor = function(logger, config) {
  var log = logger.create('preprocessor.ngInlineTemplates');
  config = typeof config === 'object' ? config : {};

  /**
   * Defines inline template preprocessor function.
   *
   * @param {String} content The content of the file to preprocess
   * @param {Array} file Information about the file
   * @param {Function} done Function to call when preprocess of the file is done
   */
  return function(content, file, done) {
    log.debug('Processing file ' + file.path);

    // Change file extension to js to make it executed in the browser
    file.path = file.path.replace('.html', '.js');
    var script = false;
    var scriptId = '';
    var scriptContent = '';
    var scripts = {};

    // Instanciate an HTML parser
    var parser = new htmlparser.Parser({

      // Handle opening tags
      onopentag: function(tagName, attributes) {

        // Start a new AngularJS template
        if (tagName === 'script' && attributes.type === 'text/ng-template' && attributes.id) {
          log.debug('Found AngularJS inline template ' + attributes.id + ' in ' + file.originalPath);
          script = true;
          scriptId = attributes.id;
        }

      },

      // Handle tags content
      ontext: function(text) {

        // Store script content
        if (script)
          scriptContent += text;

      },

      // Handle closing tags
      onclosetag: function(tagName) {

        // End AngularJS template
        if (tagName === 'script' && script) {
          script = false;
          scripts[scriptId] = scriptContent;
          scriptContent = '';
        }

      },

      // End of file
      onend: function() {
        var moduleName = config.moduleName || 'inline-templates';

        // Build a new AngularJS module with a run function
        var HTML = '(function() { \n' +
        'var module; \n' +
        'try { \n' +
          'module = angular.module(\'' + moduleName + '\'); \n' +
        '} \n' +
        'catch(error) { \n' +
          'module = angular.module(\'' + moduleName + '\', []); \n' +
        '} \n' +
        'module.run([\'$templateCache\', function($templateCache) { \n';

        // Add every inline template into template cache
        for (var id in scripts) {

          scripts[id] = scripts[id]
            .replace(/\\/g, '\\\\')
            .replace(/'/g, '\\\'')
            .replace(/\r?\n/g, '\\n\' +\n    \'');

          HTML += '$templateCache.put(\'' + id + '\', \'' + scripts[id] + '\');\n';
        }

        // End run function and module declarations
        HTML += '}]);\n })();\n';

        // Return the preprocessed output
        done(HTML);
      }
    }, {
      decodeEntities: true
    });

    // Write file content to parser
    parser.write(content);
    parser.end();

  };

};

inlineTemplatesProcessor.$inject = ['logger', 'config.ngInlineTemplatesPreprocessor'];

module.exports = {
  'preprocessor:ng-inline-templates': ['factory', inlineTemplatesProcessor]
};
