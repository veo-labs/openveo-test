'use strict';

/**
 * @module e2e/fields/CheckboxesField
 */

var util = require('util');
var Field = process.requireTest('lib/e2e/fields/Field.js');
var browserExt = process.requireTest('lib/e2e/browser.js');

/**
 * Defines a form checkboxes field.
 *
 * Use [Field.get]{@link module:e2e/fields/Field~Field.get} method to get an instance of CheckboxesField.
 *
 * @example
 * var Field = require('@openveo/test').e2e.fields.Field;
 *
 * var CheckboxesField = Field.get({
 *   type: 'checkboxes',
 *   name: 'My field',
 *   baseElement: element(by.css('form'))
 * });
 *
 * @class CheckboxesField
 * @extends module:e2e/fields/Field~Field
 * @constructor
 * @param {Object} conf A field configuration object
 */
function CheckboxesField(conf) {
  CheckboxesField.super_.call(this, conf);
}

module.exports = CheckboxesField;
util.inherits(CheckboxesField, Field);

/**
 * Gets selected checkboxe names.
 *
 * @example
 * myField.getValue().then(function(values) {
 *   console.log(values);
 * });
 *
 * @return {Promise} Promise resolving with selected checkboxes
 */
CheckboxesField.prototype.getValue = function() {
  var values = [];

  return this.getElement().then(function(elementFinder) {

    // Iterate on each checkbox labels
    elementFinder.all(by.css('.checkbox label')).each(function(label, index) {

      // Test if checkbox is checked
      browserExt.getProperty(label.element(by.css('input')), 'checked').then(function(isChecked) {

        // Get checkbox name
        label.getText().then(function(text) {
          if (isChecked)
            values.push(text.replace(/ ?\*?$/, ''));
        });

      });

    });

  }).then(function() {
    return protractor.promise.fulfilled(values);
  });
};

/**
 * Sets field value.
 *
 * @example
 * myField.setValue(['Label 1', 'Label 2']).then(function() {
 *   console.log('Value set');
 * });
 *
 * @param {Array} [values=[]] Checkboxe's values
 * @return {Promise} Promise resolving when checkboxes are checked
 */
CheckboxesField.prototype.setValue = function(values) {
  values = values || [];

  return this.getElement().then(function(elementFinder) {

    // Iterate on each checkbox labels
    elementFinder.all(by.css('.checkbox label')).each(function(label, index) {

      // Test if checkbox is checked
      browserExt.getProperty(label.element(by.css('input')), 'checked').then(function(isChecked) {

        // Get checkbox name
        label.getText().then(function(text) {
          var isPartOfValues = values.indexOf(text.replace(/ ?\*?$/, '')) >= 0;

          if ((!isChecked && isPartOfValues) || (isChecked && !isPartOfValues)) {

            // Checkbox not checked and must be or checked and must not
            browserExt.click(label);

          }
        });

      });

    });

  }).then(function() {
    return protractor.promise.fulfilled();
  });
};

/**
 * Unchecks all checkboxes.
 *
 * @example
 * myField.clear().then(function() {
 *   console.log('Field cleared');
 * });
 *
 * @return {Promise} Promise resolving when the field is cleared
 */
CheckboxesField.prototype.clear = function() {
  return this.setValue();
};

/**
 * Gets all checkboxes labels.
 *
 * @example
 * myField.getOptions().then(function(options) {
 *   console.log(options);
 * });
 *
 * @return {Promise} Promise resolving with checkboxes options
 */
CheckboxesField.prototype.getOptions = function() {
  var options = [];

  return this.getElement().then(function(elementFinder) {

    // Iterate on each checkbox labels
    elementFinder.all(by.css('.checkbox label')).each(function(label, index) {

      // Get checkbox name
      label.getText().then(function(text) {
        options.push(text.replace(/ ?\*?$/, ''));
      });

    });

  }).then(function() {
    return protractor.promise.fulfilled(options);
  });
};
