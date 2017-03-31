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
 *     var Field = require('@openveo/test').e2e.Field;
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
}

module.exports = TagsField;
util.inherits(TagsField, Field);

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
    var tagElements = elementFinder.all(by.css('li'));
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
    return elementFinder.element(by.css('.has-error')).isDisplayed();
  });
};