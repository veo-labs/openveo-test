'use strict';

/**
 * @module e2e
 */

var util = require('util');
var Field = process.requireTest('lib/e2e/fields/Field.js');

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
 * @extends Field
 */
function DateField(conf) {
  DateField.super_.call(this, conf);
}

module.exports = DateField;
util.inherits(DateField, Field);
