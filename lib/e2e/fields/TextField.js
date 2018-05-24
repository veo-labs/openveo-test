'use strict';

/**
 * @module e2e
 */

var util = require('util');
var Field = process.requireTest('lib/e2e/fields/Field.js');

/**
 * Defines a form text field.
 *
 * Use Field.get method to get an instance of TextField.
 *
 * @example
 *
 *     var Field = require('@openveo/test').e2e.fields.Field;
 *
 *     var myTextField = Field.get({
 *       type: 'text',
 *       name: 'My field',
 *       baseElement: element(by.css('form'))
 *     });
 *
 * @class TextField
 * @extends Field
 * @constructor
 * @param {Object} conf A field configuration object
 */
function TextField(conf) {
  TextField.super_.call(this, conf);

  Object.defineProperties(this, {

    /**
     * Tag name of the text field.
     *
     * @property fieldTag
     * @type ElementFinder
     * @default "input"
     */
    fieldTag: {value: 'input', writable: true}

  });

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
  var self = this;

  return this.getElement().then(function(elementFinder) {
    var fieldElement = elementFinder.element(by.css(self.fieldTag));
    return fieldElement.getAttribute('value');
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
  var fieldElement;
  var self = this;

  if (!value)
    return this.clear();

  return this.getElement().then(function(elementFinder) {
    fieldElement = elementFinder.element(by.css(self.fieldTag));
    return fieldElement.clear();
  }).then(function() {
    return self.setInputValue(fieldElement, value);
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
  var self = this;

  return this.getElement().then(function(elementFinder) {
    var fieldElement = elementFinder.element(by.css(self.fieldTag));
    return fieldElement.clear();
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
    return elementFinder.getAttribute('class').then(function(classes) {
      var errorClass = 'has-error';
      var reg = new RegExp('^' + errorClass + ' |' + errorClass + ' |' + errorClass + ' |' + errorClass + '$');
      return protractor.promise.fulfilled(reg.test(classes));
    });
  });
};
