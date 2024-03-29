'use strict';

/**
 * @module e2e/fields/DateTimeField
 */

var util = require('util');
var Field = process.requireTest('lib/e2e/fields/Field.js');
var browserExt = process.requireTest('lib/e2e/browser.js');

/**
 * Defines a form date / time field.
 *
 * Use [Field.get]{@link module:e2e/fields/Field~Field.get} method to get an instance of DateTimeField.
 *
 * @example
 * var Field = require('@openveo/test').e2e.fields.Field;
 *
 * var myTextField = Field.get({
 *   type: 'dateTime',
 *   name: 'My field',
 *   baseElement: element(by.css('form'))
 * });
 *
 * @class DateTimeField
 * @extends module:e2e/fields/Field~Field
 * @constructor
 * @param {Object} conf A field configuration object
 */
function DateTimeField(conf) {
  DateTimeField.super_.call(this, conf);

  Object.defineProperties(this,

    /** @lends module:e2e/fields/DateTimeField~DateTimeField */
    {

      /**
       * Date input locator.
       *
       * @type {Object}
       * @instance
       * @readonly
       */
      dateInputLocator: {value: by.css('input[uib-datepicker-popup]')},

      /**
       * Hours input locator.
       *
       * @type {Object}
       * @instance
       * @readonly
       */
      hoursInputLocator: {value: by.css('.hours input')},

      /**
       * Minutes input locator.
       *
       * @type {Object}
       * @instance
       * @readonly
       */
      minutesInputLocator: {value: by.css('.minutes input')}

    }

  );
}

module.exports = DateTimeField;
util.inherits(DateTimeField, Field);

/**
 * Gets field value.
 *
 * @example
 * myField.getValue().then(function(date) {
 *   console.log('Got value : ' + date);
 * });
 *
 * @return {Promise} Promise resolving with field value
 */
DateTimeField.prototype.getValue = function() {
  var self = this;

  return this.getElement().then(function(elementFinder) {
    var inputDateElement = elementFinder.element(self.dateInputLocator);
    var inputHoursElement = elementFinder.element(self.hoursInputLocator);
    var inputMinutesElement = elementFinder.element(self.minutesInputLocator);

    return protractor.promise.all([
      browserExt.getProperty(inputDateElement, 'value'),
      browserExt.getProperty(inputHoursElement, 'value'),
      browserExt.getProperty(inputMinutesElement, 'value')
    ]);

  }).then(function(results) {
    var date = new Date(results[0]);
    date.setHours(results[1] || 0);
    date.setMinutes(results[2] || 0);
    date.setSeconds(0);

    return protractor.promise.fulfilled(date);
  });
};

/**
 * Sets field value.
 *
 * @example
 * myField.setValue(new Date('2018-05-16 17:56:00')).then(function() {
 *   console.log('Value set');
 * });
 *
 * @param {Date} [value=null] Field's value
 * @return {Promise} Promise resolving when the field is filled
 */
DateTimeField.prototype.setValue = function(value) {
  var self = this;
  var inputDateElement;
  var inputHoursElement;
  var inputMinutesElement;

  if (!value) return this.clear();

  return this.getElement().then(function(elementFinder) {
    inputDateElement = elementFinder.element(self.dateInputLocator);
    inputHoursElement = elementFinder.element(self.hoursInputLocator);
    inputMinutesElement = elementFinder.element(self.minutesInputLocator);
    return self.clear();
  }).then(function() {
    return browser.executeScript(
      'var $injector = angular.injector([\'ng\']);' +
      'var $filter = $injector.get(\'$filter\');' +
      'return $filter(\'date\')(' + value.getTime() + ', \'shortDate\');'
    );
  }).then(function(shortDate) {
    return protractor.promise.all([
      Field.setInputValue(inputDateElement, shortDate),
      Field.setInputValue(inputHoursElement, value.getHours()),
      Field.setInputValue(inputMinutesElement, value.getMinutes())
    ]);
  });
};

/**
 * Clears field value.
 *
 * @example
 * myField.clear().then(function() {
 *   console.log('Field cleared');
 * });
 *
 * @return {Promise} Promise resolving when the field is cleared
 */
DateTimeField.prototype.clear = function() {
  var self = this;

  return this.getElement().then(function(elementFinder) {
    var inputDateElement = elementFinder.element(self.dateInputLocator);
    var inputHoursElement = elementFinder.element(self.hoursInputLocator);
    var inputMinutesElement = elementFinder.element(self.minutesInputLocator);
    return protractor.promise.all([
      inputDateElement.clear(),
      inputHoursElement.clear(),
      inputMinutesElement.clear()
    ]);
  });
};

/**
 * Tests if a field is considered as on error.
 *
 * @example
 * myField.isOnError().then(function(isOnError) {
 *   console.log('Is field on error ? ' + isOnError);
 * });
 *
 * @return {Promise} Promise resolving with a boolean indicating if the field is on error
 */
DateTimeField.prototype.isOnError = function() {
  return this.getElement().then(function(elementFinder) {
    return elementFinder.getAttribute('class').then(function(classes) {
      var errorClass = 'has-error';
      var reg = new RegExp('^' + errorClass + ' |' + errorClass + ' |' + errorClass + ' |' + errorClass + '$');
      return protractor.promise.fulfilled(reg.test(classes));
    });
  });
};
