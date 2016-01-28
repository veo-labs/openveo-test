'use strict';

/**
 * @module e2e
 */

var util = require('util');
var Field = process.requireTest('lib/e2e/fields/Field.js');

/**
 * A form text field.
 *
 * Use Field.get method to get an instance of TextField.
 *
 * @example
 *
 *     var Field = require('@openveo/test').e2e.Field;
 *
 *     var myTextField = Field.get({
 *       type: 'text',
 *       name: 'My field',
 *       baseElement: element(by.css('form'))
 *     });
 *
 * @class TextField
 * @constructor
 * @extends Field
 */
function TextField(conf) {
  TextField.super_.call(this, conf);
}

module.exports = TextField;
util.inherits(TextField, Field);

/**
 * Gets field value.
 *
 * @example
 *
 *     myField.getValue().then(function(value) {
 *       console.log('Got value : ' + value);
 *     });
 *
 * @method getValue
 * @return {Promise} Promise resolving with field value
 */
TextField.prototype.getValue = function() {
  return this.getElement().then(function(elementFinder) {
    var input = elementFinder.element(by.css('input'));
    return input.getAttribute('value');
  });
};

/**
 * Sets field value.
 *
 * @example
 *
 *     myField.setValue('new value').then(function() {
 *       console.log('Value set');
 *     });
 *
 * @method setValue
 * @param {String} [value=''] Field's value
 * @return {Promise} Promise resolving when the field is filled
 */
TextField.prototype.setValue = function(value) {
  var input;
  return this.getElement().then(function(elementFinder) {
    input = elementFinder.element(by.css('input'));
    return input.clear();
  }).then(function() {
    return input.sendKeys(value || '');
  });
};

/**
 * Clears field value.
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
TextField.prototype.clear = function() {
  return this.getElement().then(function(elementFinder) {
    var input = elementFinder.element(by.css('input'));
    return input.clear();
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
TextField.prototype.isOnError = function() {
  return this.getElement().then(function(elementFinder) {
    return elementFinder.element(by.css('.has-error')).isDisplayed();
  });
};