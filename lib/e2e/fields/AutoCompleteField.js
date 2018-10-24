'use strict';

/**
 * @module e2e
 */

var util = require('util');
var browserExt = process.requireTest('lib/e2e/browser.js');
var TextField = process.requireTest('lib/e2e/fields/TextField.js');

/**
 * Defines a form auto complete field.
 *
 * Use Field.get method to get an instance of AutoCompleteField.
 *
 * @example
 *
 *     var Field = require('@openveo/test').e2e.fields.Field;
 *
 *     var AutoCompleteField = Field.get({
 *       type: 'autoComplete',
 *       name: 'My field',
 *       baseElement: element(by.css('form'))
 *     });
 *
 * @class AutoCompleteField
 * @extends TextField
 * @constructor
 * @param {Object} conf A field configuration object
 */
function AutoCompleteField(conf) {
  AutoCompleteField.super_.call(this, conf);
}

module.exports = AutoCompleteField;
util.inherits(AutoCompleteField, TextField);

/**
 * Validates a suggestion from the list of suggestions.
 *
 * @method validateSuggestion
 * @param {String} suggestion The name of the suggestion in the list of suggestions
 * @return {Promise} Promise resolving when given suggestion has been validated
 */
AutoCompleteField.prototype.validateSuggestion = function(suggestion) {
  var deferred = protractor.promise.defer();
  var promises = [];

  var getSuggestion = function(suggestionElement) {
    return suggestionElement.getText().then(function(text) {
      return protractor.promise.fulfilled({
        element: suggestionElement,
        text: text
      });
    });
  };

  this.getElement().then(function(elementFinder) {
    elementFinder.all(by.css('li > div')).each(function(suggestionElement) {
      promises.push(getSuggestion(suggestionElement));
    }).then(function() {
      return protractor.promise.all(promises);
    }).then(function(suggestions) {
      for (var i = 0; i < suggestions.length; i++) {
        if (suggestions[i].text === suggestion) {
          browserExt.click(suggestions[i].element);
          return deferred.fulfill();
        }
      }
      deferred.reject(new Error('Suggestion "' + suggestion + '" not found'));
    });
  });

  return deferred.promise;
};

/**
 * Gets the list of suggestions.
 *
 * @example
 *
 *     myField.getSuggestions().then(function(suggestions) {
 *       console.log(suggestions);
 *     });
 *
 * @method getSuggestions
 * @return {Promise} Promise resolving to the list of suggestions
 */
AutoCompleteField.prototype.getSuggestions = function() {
  var deferred = protractor.promise.defer();
  var promises = [];

  this.getElement().then(function(elementFinder) {
    elementFinder.all(by.css('li > div')).each(function(suggestionElement) {
      promises.push(suggestionElement.getText());
    }).then(function() {
      return protractor.promise.all(promises);
    }).then(function(suggestions) {
      deferred.fulfill(suggestions);
    });
  });

  return deferred.promise;
};
