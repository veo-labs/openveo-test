'use strict';

/**
 * @module e2e
 */

var util = require('util');
var TextField = process.requireTest('lib/e2e/fields/TextField.js');

/**
 * A form date field.
 *
 * Use Field.get method to get an instance of DateField.
 *
 * @example
 *
 *     var Field = require('@openveo/test').e2e.Field;
 *
 *     var myDateField = Field.get({
 *       type: 'date',
 *       name: 'My field',
 *       baseElement: element(by.css('form'))
 *     });
 *
 * @class DateField
 * @constructor
 * @extends TextField
 */
function DateField(conf) {
  DateField.super_.call(this, conf);
}

module.exports = DateField;
util.inherits(DateField, TextField);
