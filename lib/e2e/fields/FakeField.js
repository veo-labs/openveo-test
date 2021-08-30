'use strict';

/**
 * @module e2e/fields/FakeField
 */

var util = require('util');
var Field = process.requireTest('lib/e2e/fields/Field.js');

/**
 * Defines a form fake field.
 *
 * FakeField is not really a field, it is just a simple text with a label.
 * Use [Field.get]{@link module:e2e/fields/Field~Field.get} method to get an instance of FakeField.
 *
 * @example
 * var Field = require('@openveo/test').e2e.fields.Field;
 *
 * var myFakeField = Field.get({
 *   type: 'fake',
 *   name: 'My field',
 *   baseElement: element(by.css('form'))
 * });
 *
 * @class FakeField
 * @extends module:e2e/fields/Field~Field
 * @constructor
 * @param {Object} conf A field configuration object
 */
function FakeField(conf) {
  FakeField.super_.call(this, conf);
}

module.exports = FakeField;
util.inherits(FakeField, Field);

/**
 * Gets fake field text.
 *
 * @example
 * myField.getValue().then(function(value) {
 *   console.log('Got text: ' + value);
 * });
 *
 * @return {Promise} Promise resolving with field text
 */
FakeField.prototype.getValue = function() {
  return this.getText();
};

/**
 * Sets field value.
 *
 * Does not do anything as this is not a real field.
 *
 * @param {String} [value=''] Field's value
 * @return {Promise} Promise resolving immediately
 */
FakeField.prototype.setValue = function(value) {
  return protractor.promise.fulfilled();
};

/**
 * Clears field value.
 *
 * Does not do anything as this is not a real field.
 *
 * @return {Promise} Promise resolving immediately
 */
FakeField.prototype.clear = function() {
  return protractor.promise.fulfilled();
};

/**
 * Tests if a field is considered as on error.
 *
 * Does not do anything as this is not a real field.
 *
 * @return {Promise} Promise resolving with false as it is not a real field, it couldn't be in error
 */
FakeField.prototype.isOnError = function() {
  return protractor.promise.fulfilled(false);
};
