'use strict';

/**
 * @module e2e
 */

/**
 * Defines a form field to help writing end to end tests.
 *
 * Help manipulate form fields in a Page.
 * Use Field.get() method to get a Field instance.
 *
 * @class Field
 * @constructor
 * @param {Object} conf A field configuration object
 */
function Field(conf) {
  Object.defineProperties(this, {

    /**
     * Field label.
     *
     * @property name
     * @type String
     * @final
     */
    name: {value: conf.name},

    /**
     * Element from where to look for the field (typically the form element).
     *
     * @property baseElement
     * @type ElementFinder
     * @final
     */
    baseElement: {value: conf.baseElement}

  });

  if (!this.name)
    throw new Error('Missing field name');
}

module.exports = Field;

/**
 * Gets an instance of a Field.
 *
 * @example
 *
 *     var Field = require('@openveo/test').e2e.fields.Field;
 *
 *     var myTextField = Field.get({
 *       type: 'text',
 *       name: 'My field',
 *       baseElement: element(by.css('form'))
 *     });
 *
 * @method get
 * @static
 * @param {Object} conf A field configuration object
 * @return {Field} An instance of a Field sub object
 */
Field.get = function(conf) {
  switch (conf.type) {
    case 'text':
      var TextField = process.requireTest('lib/e2e/fields/TextField.js');
      return new TextField(conf);

    case 'textarea':
      var TextareaField = process.requireTest('lib/e2e/fields/TextareaField.js');
      return new TextareaField(conf);

    case 'tinymce':
      var TinymceField = process.requireTest('lib/e2e/fields/TinyMCEField.js');
      return new TinymceField(conf);

    case 'select':
      var SelectField = process.requireTest('lib/e2e/fields/SelectField.js');
      return new SelectField(conf);

    case 'date':
      var DateField = process.requireTest('lib/e2e/fields/DateField.js');
      return new DateField(conf);

    case 'dateTime':
      var DateTimeField = process.requireTest('lib/e2e/fields/DateTimeField.js');
      return new DateTimeField(conf);

    case 'checkbox':
      var CheckboxField = process.requireTest('lib/e2e/fields/CheckboxField.js');
      return new CheckboxField(conf);

    case 'checkboxes':
      var CheckboxesField = process.requireTest('lib/e2e/fields/CheckboxesField.js');
      return new CheckboxesField(conf);

    case 'time':
      var TimeField = process.requireTest('lib/e2e/fields/TimeField.js');
      return new TimeField(conf);

    case 'tags':
      var TagsField = process.requireTest('lib/e2e/fields/TagsField.js');
      return new TagsField(conf);

    case 'fake':
      var FakeField = process.requireTest('lib/e2e/fields/FakeField.js');
      return new FakeField(conf);

    case 'match':
      var MatchField = process.requireTest('lib/e2e/fields/MatchField.js');
      return new MatchField(conf);

    default:
      throw new Error('Unknown field type');
  }
};

/**
 * Sets an input value.
 *
 * @method setInputValue
 * @static
 * @param {Object} inputElement Input element finder
 * @param {String} value The input value
 * @return {Promise} Promise resolving when value has been set
 */
Field.setInputValue = function(inputElement, value) {
  return browser.executeScript(
    'var fieldElement = angular.element(arguments[0]); ' +
    'fieldElement.val(arguments[1]); ' +
    'fieldElement.triggerHandler("input");',
    inputElement.getWebElement(),
    value
  );
};

/**
 * Gets field description.
 *
 * @example
 *
 *     myField.getDescription().then(function(description) {
 *       console.log('Field description is : ' + description);
 *     });
 *
 * @method getDescription
 * @return {Promise} Promise resolving with the description
 */
Field.prototype.getDescription = function() {
  return this.getElement().then(function(elementFinder) {
    var description = elementFinder.element(by.css('p'));
    return description.getText();
  });
};

/**
 * Gets field label.
 *
 * @example
 *
 *     myField.getLabel().then(function(label) {
 *       console.log('Field label is : ' + label);
 *     });
 *
 * @method getLabel
 * @return {Promise} Promise resolving with the label
 */
Field.prototype.getLabel = function() {
  return this.getElement().then(function(elementFinder) {
    var label = elementFinder.element(by.xpath('./label'));
    return label.getText();
  }).then(function(text) {
    return protractor.promise.fulfilled(text.replace(/ ?[\*:]?$/, ''));
  });
};

/**
 * Gets field element wrapper.
 *
 * Look for a form element label and return its parent.
 *
 * @method getElement
 * @return {Promise} Promise resolving with the element
 */
Field.prototype.getElement = function() {
  var self = this;
  var fieldElement;
  var deferred = protractor.promise.defer();

  // Get all labels
  this.baseElement.all(by.css('label')).each(function(label, index) {

    // Get label text
    label.getText().then(function(text) {

      // Label text corresponds to the searched text
      // Return parent element
      if (text.replace(/ ?[\*:]?$/, '') === self.name)
        fieldElement = label.element(by.xpath('..'));

    });
  }).then(function() {
    if (fieldElement)
      deferred.fulfill(fieldElement);
    else
      deferred.reject(new Error('"' + self.name + '" field not found'));
  }, function(error) {
    deferred.reject(new Error('"' + self.name + '" field not found (' + error.message + ')'));
  });

  return deferred.promise;
};

/**
 * Gets field error message.
 *
 * @example
 *
 *     myField.getErrorMessage().then(function(errorMessage) {
 *       console.log('Error message : ' + errorMessage);
 *     });
 *
 * @method getErrorMessage
 * @return {Promise} Promise resolving with the error message
 */
Field.prototype.getErrorMessage = function() {
  return this.getElement().then(function(elementFinder) {
    var errorElement = elementFinder.element(by.binding('$error'));
    return errorElement.getText();
  }).then(function(errorMessage) {
    return protractor.promise.fulfilled(errorMessage);
  });
};

/**
 * Gets field text representation in case of an inline editable field.
 *
 * @example
 *
 *     myField.getText().then(function(text) {
 *       console.log(text);
 *     });
 *
 * @method getText
 * @return {Promise} Promise resolving with field text representation
 */
Field.prototype.getText = function() {
  return this.getElement().then(function(elementFinder) {
    var textElement = elementFinder.all(by.css('div > div')).first();
    return textElement.getText();
  }).then(function(text) {
    return protractor.promise.fulfilled(text);
  });
};

/**
 * Gets field value.
 *
 * @example
 *
 *     myField.getValue().then(function(value) {
 *       console.log(value);
 *     });
 *
 * @method getValue
 * @return {Promise} Promise resolving with field value
 */
Field.prototype.getValue = function() {
  throw new Error('Method getValue not implemented for this Field');
};

/**
 * Sets field value.
 *
 * @example
 *
 *     myField.setValue('new value').then(function() {
 *       console.log('Value set');
 *     });
 *
 * @method setValue
 * @param {String|Object|Number|Boolean} [value] Field's value depending on its type
 * @return {Promise} Promise resolving when the value is set
 */
Field.prototype.setValue = function(value) {
  throw new Error('Method setValue not implemented for this Field');
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
Field.prototype.clear = function() {
  throw new Error('Method clear not implemented for this Field');
};

/**
 * Tests if a field is considered as on error.
 *
 * @example
 *
 *     myField.isOnError().then(function(isOnError) {
 *       console.log('Is field on error ? ' + isOnError);
 *     });
 *
 * @method isOnError
 * @return {Promise} Promise resolving with a boolean indicating if the field is on error
 */
Field.prototype.isOnError = function() {
  throw new Error('Method isOnError not implemented for this Field');
};
