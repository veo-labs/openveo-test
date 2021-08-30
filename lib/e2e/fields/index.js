'use strict';

/**
 * Exposes a list of modules to help drive form fields.
 *
 * @module e2e/fields
 * @property {module:e2e/fields/Field} Field Field module
 * @property {module:e2e/fields/CheckboxField} CheckboxField CheckboxField module
 * @property {module:e2e/fields/CheckboxesField} CheckboxesField CheckboxesField module
 * @property {module:e2e/fields/DateField} DateField DateField module
 * @property {module:e2e/fields/SelectField} SelectField SelectField module
 * @property {module:e2e/fields/TagsField} TagsField TagsField module
 * @property {module:e2e/fields/TextareaField} TextareaField TextareaField module
 * @property {module:e2e/fields/TextField} TextField TextField module
 * @property {module:e2e/fields/TinyMCEField} TinyMCEField TinyMCEField module
 * @property {module:e2e/fields/TimeField} TimeField TimeField module
 * @property {module:e2e/fields/AutoCompleteField} AutoCompleteField AutoCompleteField module
 * @property {module:e2e/fields/FakeField} FakeField FakeField module
 * @property {module:e2e/fields/MatchField} MatchField MatchField module
 */

module.exports.Field = process.requireTest('lib/e2e/fields/Field.js');
module.exports.CheckboxField = process.requireTest('lib/e2e/fields/CheckboxField.js');
module.exports.CheckboxesField = process.requireTest('lib/e2e/fields/CheckboxesField.js');
module.exports.DateField = process.requireTest('lib/e2e/fields/DateField.js');
module.exports.SelectField = process.requireTest('lib/e2e/fields/SelectField.js');
module.exports.TagsField = process.requireTest('lib/e2e/fields/TagsField.js');
module.exports.TextareaField = process.requireTest('lib/e2e/fields/TextareaField.js');
module.exports.TextField = process.requireTest('lib/e2e/fields/TextField.js');
module.exports.TinyMCEField = process.requireTest('lib/e2e/fields/TinyMCEField.js');
module.exports.TimeField = process.requireTest('lib/e2e/fields/TimeField.js');
module.exports.AutoCompleteField = process.requireTest('lib/e2e/fields/AutoCompleteField.js');
module.exports.FakeField = process.requireTest('lib/e2e/fields/FakeField.js');
module.exports.MatchField = process.requireTest('lib/e2e/fields/MatchField.js');
