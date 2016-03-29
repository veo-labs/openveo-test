'use strict';

/**
 * @module e2e
 */

var util = require('util');
var Field = process.requireTest('lib/e2e/fields/Field.js');
var browserExt = process.requireTest('lib/e2e/browser.js');

/**
 * A form checkbox field.
 *
 * Use Field.get method to get an instance of CheckboxField.
 *
 * @example
 *
 *     var Field = require('@openveo/test').e2e.Field;
 *
 *     var CheckboxField = Field.get({
 *       type: 'checkbox',
 *       name: 'My field',
 *       baseElement: element(by.css('form'))
 *     });
 *
 * @class CheckboxField
 * @constructor
 * @extends Field
 */
function CheckboxField(conf) {
  CheckboxField.super_.call(this, conf);
}

module.exports = CheckboxField;
util.inherits(CheckboxField, Field);

/**
 * Gets selected checkbox name.
 *
 * @example
 *
 *     myField.getValue().then(function(value) {
 *       console.log(value);
 *     });
 *
 * @method getValue
 * @return {Promise} Promise resolving with selected checkbox
 */
CheckboxField.prototype.getValue = function() {
  return this.getElement().then(function(elementFinder) {
    var labelFinder = elementFinder.element(by.css('.checkbox label'));
    return protractor.promise.all([labelFinder.getText(), labelFinder.getAttribute('checked')]);
  }).then(function(results) {
    return protractor.promise.fulfilled(results[1] ? results[0] : null);
  });
};

/**
 * Sets field value.
 *
 * @example
 *
 *     myField.setValue(true).then(function() {
 *       console.log('Value set');
 *     });
 *
 * @method setValue
 * @param {Boolean} [value=false] Checkbox's value
 * @return {Promise} Promise resolving when checkbox is checked / unchecked
 */
CheckboxField.prototype.setValue = function(value) {
  return this.getElement().then(function(elementFinder) {
    var inputFinder = elementFinder.element(by.css('.checkbox label input'));
    inputFinder.getAttribute('checked').then(function(isChecked) {
      if ((!isChecked && value) || (isChecked && !value))
        browserExt.click(inputFinder);
    });
  }).then(function() {
    return protractor.promise.fulfilled();
  });
};

/**
 * Unchecks the checkbox.
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
CheckboxField.prototype.clear = function() {
  return this.setValue();
};
