'use strict';

/**
 * @module e2e
 */

var util = require('util');
var browserExt = process.requireTest('lib/e2e/browser.js');
var Field = process.requireTest('lib/e2e/fields/Field.js');

/**
 * Defines a form tags field.
 *
 * Use Field.get method to get an instance of TagsField.
 *
 * @example
 *
 *     var Field = require('@openveo/test').e2e.fields.Field;
 *
 *     var TagsField = Field.get({
 *       type: 'tags',
 *       name: 'My field',
 *       baseElement: element(by.css('form'))
 *     });
 *
 * @class TagsField
 * @extends Field
 * @constructor
 * @param {Object} conf A field configuration object
 */
function TagsField(conf) {
  TagsField.super_.call(this, conf);

  Object.defineProperties(this, {

    /**
     * The list of available options.
     *
     * @property availableOptions
     * @type Array
     */
    availableOptions: {value: conf.availableOptions}

  });
}

module.exports = TagsField;
util.inherits(TagsField, Field);

/**
 * Selects a tag in auto complete.
 *
 * @method selectTagInAutoComplete
 * @private
 * @param {String} The value of the tag to select in the auto complete. It should be the same value as the
 * one in the available options
 * @return {Promise} Promise resolving when given tag has been selected in auto complete
 */
function selectTagInAutoComplete(tag) {
  var tagName;

  // Find the name of the tag from vailable options
  for (var i = 0; i < this.availableOptions.length; i++) {
    if (this.availableOptions[i].value === tag) {
      tagName = this.availableOptions[i].name;
      break;
    }
  }

  return this.getElement().then(function(elementFinder) {
    elementFinder.all(by.css('.ov-field-tags-auto-complete li')).each(function(autoCompleteElement) {
      autoCompleteElement.getText().then(function(text) {
        if (text === tagName)
          browserExt.click(autoCompleteElement);
      });
    });
  });
}

/**
 * Gets field values, the list of tags.
 *
 * @example
 *
 *     myField.getValue().then(function(tags) {
 *       console.log(tags);
 *     });
 *
 * @method getValue
 * @return {Promise} Promise resolving with the list of tags
 */
TagsField.prototype.getValue = function() {
  return this.getElement().then(function(elementFinder) {
    var deferred = protractor.promise.defer();
    var tagElements = elementFinder.all(by.css('ul')).get(0).all(by.css('li'));
    var promises = [];

    // Get text of each tag
    tagElements.each(function(tagElement, index) {
      promises.push(tagElement.getText());
    }).then(function() {
      protractor.promise.all(promises).then(function(tags) {
        deferred.fulfill(tags);
      }, function(error) {
        deferred.reject(error);
      });
    });

    return deferred.promise;
  });
};

/**
 * Sets field value.
 *
 * @example
 *
 *     myField.setValue(['tag 1', 'tag 2']).then(function() {
 *       console.log('Value set');
 *     });
 *
 * @method setValue
 * @param {Array} [values=[]] Field's list of tags
 * @return {Promise} Promise resolving when the field is filled
 */
TagsField.prototype.setValue = function(values) {
  var self = this;

  if (!values || !values.length)
    return this.clear();

  return this.clear().then(function() {
    return self.getElement();
  }).then(function(elementFinder) {
    var fieldElement = elementFinder.element(by.css('input'));
    var promises = [fieldElement.clear()];

    // Add tags one by one
    for (var i = 0; i < values.length; i++) {
      promises.push(fieldElement.sendKeys(values[i] + protractor.Key.ENTER));
      promises.push(fieldElement.clear());
    }

    return protractor.promise.all(promises);
  });
};

/**
 * Sets field value using auto completion.
 *
 * @example
 *
 *     myField.setValueUsingAutoCompletion(['tag 1', 'tag 2']).then(function() {
 *       console.log('Value set');
 *     });
 *
 * @method setValueUsingAutoCompletion
 * @param {Array} [values=[]] Field's list of tags
 * @return {Promise} Promise resolving when the field is filled
 */
TagsField.prototype.setValueUsingAutoCompletion = function(values) {
  var self = this;

  if (!values || !values.length)
    return this.clear();

  return this.clear().then(function() {
    return self.getElement();
  }).then(function(elementFinder) {
    var fieldElement = elementFinder.element(by.css('input'));
    var promises = [fieldElement.clear()];

    // Add tags one by one
    for (var i = 0; i < values.length; i++) {
      promises.push(fieldElement.sendKeys(values[i]));
      promises.push(selectTagInAutoComplete.call(self, values[i]));
      promises.push(fieldElement.clear());
    }

    return protractor.promise.all(promises);
  });
};

/**
 * Clears field value by removing all tags.
 *
 * @example
 *
 *     myField.clear().then(function() {
 *       console.log('Field cleared');
 *     });
 *
 * @method clear
 * @return {Promise} Promise resolving when the field is cleared
 */
TagsField.prototype.clear = function() {
  return this.getElement().then(function(elementFinder) {
    var deferred = protractor.promise.defer();
    var removeLinkElements = elementFinder.all(by.css('a'));

    // Click on each tag remove link
    removeLinkElements.each(function(removeLinkElement, index) {
      browserExt.click(removeLinkElement);
    }).then(function() {
      deferred.fulfill();
    });

    return deferred.promise;
  });
};

/**
 * Tests if a field is considered as on error.
 *
 * @example
 *
 *     myField.isOnError().then(function(isOnError) {
 *       console.log('Is field on error ? ' + isOnError);
 *     });
 *
 * @method isOnError
 * @return {Promise} Promise resolving with a boolean indicating if the field is on error
 */
TagsField.prototype.isOnError = function() {
  return this.getElement().then(function(elementFinder) {
    return elementFinder.getAttribute('class').then(function(classes) {
      var errorClass = 'has-error';
      var reg = new RegExp('^' + errorClass + ' |' + errorClass + ' |' + errorClass + ' |' + errorClass + '$');
      return protractor.promise.fulfilled(reg.test(classes));
    });
  });
};
