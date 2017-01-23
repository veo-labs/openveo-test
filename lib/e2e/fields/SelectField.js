'use strict';

/**
 * @module e2e
 */

var util = require('util');
var Field = process.requireTest('lib/e2e/fields/Field.js');
var browserExt = process.requireTest('lib/e2e/browser.js');

/**
 * Defines a form select field.
 *
 * Use Field.get method to get an instance of SelectField.
 *
 * @example
 *
 *     var Field = require('@openveo/test').e2e.Field;
 *
 *     var mySelectField = Field.get({
 *       type: 'select',
 *       name: 'My field',
 *       baseElement: element(by.css('form'))
 *     });
 *
 * @class SelectField
 * @extends Field
 * @constructor
 */
function SelectField(conf) {
  SelectField.super_.call(this, conf);
}

module.exports = SelectField;
util.inherits(SelectField, Field);

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
 * @return {Promise} Promise resolving with the name of the selected option (not the value)
 */
SelectField.prototype.getValue = function() {
  var fieldElement;

  return this.getElement().then(function(elementFinder) {
    fieldElement = elementFinder;
    var select = fieldElement.element(by.css('select'));

    // Get selected value
    return browser.executeScript('return arguments[0].value;', select.getWebElement());
  }).then(function(value) {
    var option = fieldElement.element(by.css('option[value="' + value + '"]'));
    return option.getText();
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
 * @param {String} [value=''] The name of the option to select (not the value)
 * @return {Promise} Promise resolving when the field is filled
 */
SelectField.prototype.setValue = function(value) {
  if (!value)
    return this.clear();

  return this.getElement().then(function(elementFinder) {
    var option = elementFinder.element(by.cssContainingText('option', value));
    return browserExt.click(option);
  });
};

/**
 * Clears field value.
 *
 * This will select the first option of the select element.
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
SelectField.prototype.clear = function() {
  return this.getElement().then(function(elementFinder) {
    var option = elementFinder.all(by.css('option')).get(0);
    return browserExt.click(option);
  });
};
