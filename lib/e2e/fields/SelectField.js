'use strict';

/**
 * @module e2e
 */

var util = require('util');
var Field = process.requireTest('lib/e2e/fields/Field.js');

/**
 * A form select field.
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
 * @constructor
 * @extends Field
 */
function SelectField(conf) {
  SelectField.super_.call(this, conf);
}

module.exports = SelectField;
util.inherits(SelectField, Field);
