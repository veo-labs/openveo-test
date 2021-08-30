'use strict';

/**
 * @module e2e/fields/TextareaField
 */

var util = require('util');
var TextField = process.requireTest('lib/e2e/fields/TextField.js');

/**
 * Defines a form text field.
 *
 * Use [Field.get]{@link module:e2e/fields/Field~Field.get} method to get an instance of TextareaField.
 *
 * @example
 * var Field = require('@openveo/test').e2e.fields.Field;
 *
 * var myTextareaField = Field.get({
 *   type: 'textarea',
 *   name: 'My field',
 *   baseElement: element(by.css('form'))
 * });
 *
 * @class TextareaField
 * @extends module:e2e/fields/Field~Field
 * @constructor
 * @param {Object} conf A field configuration object
 */
function TextareaField(conf) {
  TextareaField.super_.call(this, conf);
  this.fieldTag = 'textarea';
}

module.exports = TextareaField;
util.inherits(TextareaField, TextField);
