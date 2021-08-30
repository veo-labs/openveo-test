'use strict';

/**
 * @module e2e/fields/MatchField
 */

var util = require('util');
var browserExt = process.requireTest('lib/e2e/browser.js');
var Field = process.requireTest('lib/e2e/fields/Field.js');
var TextField = process.requireTest('lib/e2e/fields/TextField.js');
var TagsField = process.requireTest('lib/e2e/fields/TagsField.js');

/**
 * Defines a form match field.
 *
 * Use [Field.get]{@link module:e2e/fields/Field~Field.get} method to get an instance of MatchField.
 *
 * @example
 * var Field = require('@openveo/test').e2e.fields.Field;
 *
 * var MatchField = Field.get({
 *   type: 'match',
 *   name: 'My field',
 *   baseElement: element(by.css('form'))
 * });
 *
 * @class MatchField
 * @extends module:e2e/fields/Field~Field
 * @constructor
 * @param {Object} conf A field configuration object
 */
function MatchField(conf) {
  MatchField.super_.call(this, conf);

  Object.defineProperties(this,

    /** @lends module:e2e/fields/MatchField~MatchField */
    {

      /**
       * The list of available options for tags.
       *
       * @type {Array}
       * @instance
       * @readonly
       */
      availableOptions: {value: conf.availableOptions}

    }

  );
}

module.exports = MatchField;
util.inherits(MatchField, Field);

/**
 * Defines a MatchTextField.
 *
 * A MatchTextField is a field part of a match, it is pretty much like
 * a [TextField]{@link module:e2e/fields/TextField~TextField} except that it is part of a match.
 *
 * @class MatchTextField
 * @extends module:e2e/fields/TextField~TextField
 * @constructor
 * @param {Object} conf Field configuration
 * @param {String} conf.name Field configuration
 * @param {Object} conf.baseElement The match element
 */
function MatchTextField(conf) {
  MatchTextField.super_.call(this, conf);
}
util.inherits(MatchTextField, TextField);

/**
 * Gets match text field element wrapper.
 *
 * @return {Promise} Promise resolving with the element
 */
MatchTextField.prototype.getElement = function() {
  return protractor.promise.fulfilled(this.baseElement.all(by.css('input')).get(0).element(by.xpath('..')));
};

/**
 * Defines a MatchTagsField.
 *
 * A MatchTagsField is a field part of a match, it is pretty much like
 * a [TagsField]{@link module:e2e/fields/TagsField~TagsField} except that it is part of a match.
 *
 * @class MatchTagsField
 * @extends module:e2e/fields/TagsField~TagsField
 * @constructor
 * @param {Object} conf Field configuration
 * @param {String} conf.name Field configuration
 * @param {Object} conf.baseElement The match element
 */
function MatchTagsField(conf) {
  MatchTagsField.super_.call(this, conf);
}
util.inherits(MatchTagsField, TagsField);

/**
 * Gets match tags field element wrapper.
 *
 * @return {Promise} Promise resolving with the element
 */
MatchTagsField.prototype.getElement = function() {
  return protractor.promise.fulfilled(this.baseElement.element(by.css('.ov-field-tags')));
};

/**
 * Gets value of a match.
 *
 * @method getMatchValue
 * @private
 * @memberof module:e2e/fields/MatchField~MatchField
 * @this module:e2e/fields/MatchField~MatchField
 * @param {Object} matchFinder Finder for the match
 * @return {Promise} Promise resolving with the value of the match
 */
function getMatchValue(matchFinder) {
  var match = {};
  var textField = new MatchTextField({
    name: 'Whatever',
    baseElement: matchFinder
  });
  var tagsField = new MatchTagsField({
    name: 'Whatever',
    baseElement: matchFinder,
    availableOptions: this.availableOptions
  });

  return textField.getValue().then(function(text) {
    match.text = text;
    return tagsField.getValue();
  }).then(function(tags) {
    match.tags = tags;
    return protractor.promise.fulfilled(match);
  });
}

/**
 * Removes a match by clicking on the remove button.
 *
 * @method removeMatch
 * @private
 * @memberof module:e2e/fields/MatchField~MatchField
 * @this module:e2e/fields/MatchField~MatchField
 * @param {Object} matchFinder Finder for the match
 * @return {Promise} Promise resolving with the value of the match
 */
function removeMatch(matchFinder) {
  return browserExt.click(matchFinder.element(by.css('.ov-field-match-remove-icon')));
}

/**
 * Adds a new match using add button, text field and tags field.
 *
 * @method addMatchValue
 * @private
 * @memberof module:e2e/fields/MatchField~MatchField
 * @this module:e2e/fields/MatchField~MatchField
 * @param {Object} value The match value
 * @param {String} value.text The match text field value
 * @param {String} value.tags The match tags field value
 * @return {Promise} Promise resolving when match has been added
 */
function addMatchValue(value) {
  var finder;
  var self = this;

  return this.getElement().then(function(elementFinder) {
    finder = elementFinder;
    return browserExt.click(elementFinder.element(by.css('.ov-field-match-add-button')));
  }).then(function() {
    var matchFinder = finder.all(by.repeater('match in matches')).last();

    var textField = new MatchTextField({
      name: 'Whatever',
      baseElement: matchFinder
    });
    var tagsField = new MatchTagsField({
      name: 'Whatever',
      baseElement: matchFinder,
      availableOptions: self.availableOptions
    });

    return textField.setValue(value.text).then(function() {
      return tagsField.setValue(value.tags);
    });
  });
}

/**
 * Adds a new match using add button, text field and tags field with auto completion.
 *
 * @method addMatchValueUsingAutoCompletion
 * @private
 * @memberof module:e2e/fields/MatchField~MatchField
 * @this module:e2e/fields/MatchField~MatchField
 * @param {Object} value The match value
 * @param {String} value.text The match text field value
 * @param {String} value.tags The match tags field value
 * @return {Promise} Promise resolving when match has been added
 */
function addMatchValueUsingAutoCompletion(value) {
  var finder;
  var self = this;

  return this.getElement().then(function(elementFinder) {
    finder = elementFinder;
    return browserExt.click(elementFinder.element(by.css('.ov-field-match-add-button')));
  }).then(function() {
    var matchFinder = finder.all(by.repeater('match in matches')).last();

    var textField = new MatchTextField({
      name: 'Whatever',
      baseElement: matchFinder
    });
    var tagsField = new MatchTagsField({
      name: 'Whatever',
      baseElement: matchFinder,
      availableOptions: self.availableOptions
    });

    return textField.setValue(value.text).then(function() {
      return tagsField.setValueUsingAutoCompletion(value.tags);
    });
  });
}

/**
 * Gets field value, the list of associations (matches).
 *
 * @example
 * myField.getValue().then(function(matches) {
 *   console.log(matches);
 * });
 *
 * @return {Promise} Promise resolving with the list of matches
 */
MatchField.prototype.getValue = function() {
  var self = this;

  return this.getElement().then(function(elementFinder) {
    var deferred = protractor.promise.defer();
    var promises = [];

    elementFinder.all(by.repeater('match in matches')).each(function(matchFinder) {
      promises.push(getMatchValue.call(self, matchFinder));
    }).then(function() {
      protractor.promise.all(promises).then(function(matches) {
        deferred.fulfill(matches);
      }, function(error) {
        deferred.reject(error);
      });
    });

    return deferred.promise;
  });
};

/**
 * Sets field value.
 *
 * @example
 * myField.setValue([
 *   {
 *     text: 'text',
 *     tags: ['tags1', 'tags2', 'tags3']
 *   },
 *   {
 *     text: 'text2',
 *     tags: ['tags4', 'tags5', 'tags6']
 *   }
 * ]).then(function() {
 *   console.log('Value set');
 * });
 *
 * @param {Array} [values] List of matches
 * @return {Promise} Promise resolving when the field is filled
 */
MatchField.prototype.setValue = function(values) {
  var self = this;

  if (!values || !values.length)
    return this.clear();

  return this.clear().then(function() {
    var promises = [];

    // Add matches one by one
    for (var i = 0; i < values.length; i++)
      promises.push(addMatchValue.call(self, values[i]));

    return protractor.promise.all(promises);
  });
};

/**
 * Sets field value using auto completion.
 *
 * @example
 * myField.setValueUsingAutoCompletion([
 *   {
 *     text: 'text',
 *     tags: ['tags1', 'tags2', 'tags3']
 *   },
 *   {
 *     text: 'text2',
 *     tags: ['tags4', 'tags5', 'tags6']
 *   }
 * ]).then(function() {
 *   console.log('Value set');
 * });
 *
 * @param {Array} [values] List of matches
 * @return {Promise} Promise resolving when the field is filled
 */
MatchField.prototype.setValueUsingAutoCompletion = function(values) {
  var self = this;

  if (!values || !values.length)
    return this.clear();

  return this.clear().then(function() {
    var promises = [];

    // Add matches one by one
    for (var i = 0; i < values.length; i++)
      promises.push(addMatchValueUsingAutoCompletion.call(self, values[i]));

    return protractor.promise.all(promises);
  });
};

/**
 * Clears field value by removing all tags.
 *
 * @example
 * myField.clear().then(function() {
 *   console.log('Field cleared');
 * });
 *
 * @return {Promise} Promise resolving when the field is cleared
 */
MatchField.prototype.clear = function() {
  return this.getElement().then(function(elementFinder) {
    var deferred = protractor.promise.defer();
    var promises = [];

    elementFinder.all(by.repeater('match in matches')).each(function(matchFinder) {
      promises.push(removeMatch(matchFinder));
    }).then(function() {
      protractor.promise.all(promises).then(function() {
        deferred.fulfill();
      }, function(error) {
        deferred.reject(error);
      });
    });

    return deferred.promise;
  });
};

/**
 * Tests if field is considered as on error.
 *
 * @example
 * myField.isOnError().then(function(isOnError) {
 *   console.log('Is field on error ? ' + isOnError);
 * });
 *
 * @return {Promise} Promise resolving with a boolean indicating if the field is on error
 */
MatchField.prototype.isOnError = function() {
  return this.getElement().then(function(elementFinder) {
    return elementFinder.getAttribute('class').then(function(classes) {
      var errorClass = 'has-error';
      var reg = new RegExp('^' + errorClass + ' |' + errorClass + ' |' + errorClass + ' |' + errorClass + '$');
      return protractor.promise.fulfilled(reg.test(classes));
    });
  });
};

/**
 * Gets the add button label.
 *
 * @example
 * myField.getAddLabel().then(function(label) {
 *   console.log('Add button label: ' + label);
 * });
 *
 * @return {Promise} Promise resolving with the button label
 */
MatchField.prototype.getAddLabel = function() {
  return this.getElement().then(function(elementFinder) {
    return elementFinder.element(by.css('.ov-field-match-add-label')).getText();
  });
};

/**
 * Gets the input placeholder.
 *
 * @example
 * myField.getInputPlaceholder().then(function(placeholder) {
 *   console.log('Input placeholder: ' + placeholder);
 * });
 *
 * @return {Promise} Promise resolving with the input placeholder
 */
MatchField.prototype.getInputPlaceholder = function() {
  return this.getElement().then(function(elementFinder) {
    return elementFinder.all(by.css('input')).get(0).getAttribute('placeholder');
  });
};

/**
 * Gets the tags placeholder.
 *
 * @example
 * myField.getTagsPlaceholder().then(function(placeholder) {
 *   console.log('Tags placeholder: ' + placeholder);
 * });
 *
 * @return {Promise} Promise resolving with the tags placeholder
 */
MatchField.prototype.getTagsPlaceholder = function() {
  return this.getElement().then(function(elementFinder) {
    return elementFinder.all(by.css('input')).get(1).getAttribute('placeholder');
  });
};
