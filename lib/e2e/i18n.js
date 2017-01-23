'use strict';

/**
 * @module e2e
 */

/**
 * Helps retrieving project's translations.
 *
 * @class i18n
 * @static
 */

var openVeoAPI = require('@openveo/api');

/**
 * Gets translations.
 *
 * @example
 *
 *     var i18n = require('@openveo/test').e2e.i18n;
 *
 *     i18n.getTranslations('login', 'en').then(function(translations) {
 *       console.log(translations);
 *     });
 *
 * @method getTranslations
 * @static
 * @param {String} dictionary The name of the dictionary, this is the name of the dictionary file without
 * extension
 * @param {String} languageCode The language code (e.g. en)
 * @return {Promise} Promise resolving with the list of translations
 */
module.exports.getTranslations = function(dictionary, languageCode) {
  var deferred = protractor.promise.defer();

  openVeoAPI.i18n.getTranslations(dictionary, languageCode, function(error, translations) {
    deferred.fulfill(translations);
  });

  return deferred.promise;
};

/**
 * Gets the list of back end translations.
 *
 * @example
 *
 *     var i18n = require('@openveo/test').e2e.i18n;
 *
 *     i18n.getBackEndTranslations('en').then(function(backEndTranslations) {
 *       console.log(backEndTranslations);
 *     });
 *
 * @method getBackEndTranslations
 * @static
 * @param {String} languageCode The language code (e.g. en)
 * @return {Promise} Promise resolving with the list of translations
 */
module.exports.getBackEndTranslations = function(languageCode) {
  var self = this;

  return browser.waitForAngular().then(function() {
    var promises = [
      self.getTranslations('admin-back-office', languageCode),
      self.getTranslations('common', languageCode)
    ];

    return protractor.promise.all(promises).then(function(translations) {
      openVeoAPI.util.merge(translations[0], translations[1]);
      return protractor.promise.fulfilled(translations[0]);
    });
  });
};
