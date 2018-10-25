'use strict';

/**
 * @module e2e
 */

var util = require('util');
var Field = process.requireTest('lib/e2e/fields/Field.js');

/**
 * Defines a form time field.
 *
 * Use Field.get method to get an instance of TimeField.
 *
 * @example
 *
 *     var Field = require('@openveo/test').e2e.fields.Field;
 *
 *     var TimeField = Field.get({
 *       type: 'time',
 *       name: 'My time field',
 *       baseElement: element(by.css('form'))
 *     });
 *
 * @class TimeField
 * @extends Field
 * @constructor
 * @param {Object} conf A field configuration object
 */
function TimeField(conf) {
  TimeField.super_.call(this, conf);
}

module.exports = TimeField;
util.inherits(TimeField, Field);

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
TimeField.prototype.getValue = function() {
  return this.getElement().then(function(elementFinder) {
    var input = elementFinder.element(by.css('input'));
    return input.getAttribute('value');
  }).then(function(value) {
    return protractor.promise.fulfilled(value.replace('.000', ''));
  });
};

/**
 * Sets field value.
 *
 * Actually it's not possible to use the Web Driver to set the value of the input in time state.
 * Until this feature is added to the Web Driver, value of the input is set programmatically.
 * Be careful events on the input won't be dispatched (change, click and so on).
 *
 * @example
 *
 *     myField.setValue('new value').then(function() {
 *       console.log('Value set');
 *     });
 *
 * @method setValue
 * @param {String} [value='00:00:00'] Field's value format as hh:mm:ss
 * @return {Promise} Promise resolving when the field is filled
 */
TimeField.prototype.setValue = function(value) {
  var input;

  if (!value)
    return this.clear();

  return this.getElement().then(function(elementFinder) {
    input = elementFinder.element(by.css('input'));
    var promises = [input.getAttribute('min'), input.getAttribute('max')];
    return protractor.promise.all(promises);
  }).then(function(bounds) {
    var dateMin = new Date('1970-01-01T' + bounds[0]);
    var date = new Date('1970-01-01T' + value);
    var dateMax = new Date('1970-01-01T' + bounds[1]);
    if (date.getTime() >= dateMin.getTime() && date.getTime() <= dateMax.getTime()) {
      return browser.executeScript(
        'var scope = angular.element(arguments[0]).scope(); scope.editTime = new Date(' +
        (date.getTime() + date.getTimezoneOffset() * 60000) + '); scope.$apply();',
        input.getWebElement()
      );
    } else
      return protractor.promise.rejected(new Error('Time must be between ' + bounds[0] + ' and ' + bounds[1]));
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
TimeField.prototype.clear = function() {
  return this.setValue('00:00:00');
};
