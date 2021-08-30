'use strict';

/**
 * @module e2e/fields/TinyMCEField
 */

var util = require('util');
var Field = process.requireTest('lib/e2e/fields/Field.js');

/**
 * Defines a form tinyIMCE field.
 *
 * Use [Field.get]{@link module:e2e/fields/Field~Field.get} method to get an instance of TinyMCEField.
 *
 * @example
 * var Field = require('@openveo/test').e2e.fields.Field;
 *
 * var myTinyMCEField = Field.get({
 *   type: 'tinymce',
 *   name: 'My field',
 *   baseElement: element(by.css('form'))
 * });
 *
 * @class TinyMCEField
 * @extends module:e2e/fields/Field~Field
 * @constructor
 * @param {Object} conf A field configuration object
 */
function TinyMCEField(conf) {
  TinyMCEField.super_.call(this, conf);
}

module.exports = TinyMCEField;
util.inherits(TinyMCEField, Field);

/**
 * Gets field value.
 *
 * @example
 * myField.getValue().then(function(value) {
 *   console.log('Got value : ' + value);
 * });
 *
 * @return {Promise} Promise resolving with field value
 */
TinyMCEField.prototype.getValue = function() {
  return browser.executeScript('return tinyMCE.activeEditor.getContent()');
};

/**
 * Sets field value.
 *
 * @example
 * myField.setValue('new value').then(function() {
 *   console.log('Value set');
 * });
 *
 * @param {String} [value=''] Field's value
 * @return {Promise} Promise resolving when the field is filled
 */
TinyMCEField.prototype.setValue = function(value) {
  if (!value)
    return this.clear();

  return this.clear().then(function() {
    return browser.executeScript('return tinyMCE.activeEditor.insertContent("' + value + '")');
  });
};

/**
 * Clears field value.
 *
 * @example
 * myField.clear().then(function() {
 *   console.log('Field cleared');
 * });
 *
 * @return {Promise} Promise resolving when the field is cleared
 */
TinyMCEField.prototype.clear = function() {
  return browser.executeScript('return tinyMCE.activeEditor.setContent("")');
};
