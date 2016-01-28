'use strict';

/**
 * @module e2e
 */

var util = require('util');
var TextField = process.requireTest('lib/e2e/fields/TextField.js');

/**
 * A form text field.
 *
 * Use Field.get method to get an instance of TextareaField.
 *
 * @example
 *
 *     var Field = require('@openveo/test').e2e.Field;
 *
 *     var myTextareaField = Field.get({
 *       type: 'textarea',
 *       name: 'My field',
 *       baseElement: element(by.css('form'))
 *     });
 *
 * @class TextareaField
 * @constructor
 * @extends Field
 */
function TextareaField(conf) {
  TextareaField.super_.call(this, conf);

  this.fieldTag = 'textarea';
}

module.exports = TextareaField;
util.inherits(TextareaField, TextField);
