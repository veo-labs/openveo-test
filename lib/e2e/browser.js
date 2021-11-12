'use strict';

/**
 * Helps using some protractor browser's features.
 *
 * @module e2e/browser
 */

var path = require('path');
var fs = require('fs');
var openVeoAPI = require('@openveo/api');

/**
 * Writes screenshot to a file.
 *
 * @method writeScreenShot
 * @private
 * @static
 * @param {String} data Screenshot data
 * @param {String} file Screenshot final file path
 * @param {callback} callback The function to call when done
 */
function writeScreenShot(data, file, callback) {
  var stream = fs.createWriteStream(file);
  stream.write(Buffer.from(data, 'base64'));
  stream.end();
  stream.on('finish', callback);
}

/**
 * Clicks on an element.
 *
 * There are many issues with click events in web drivers, the same click is sometimes performed, and sometimes not.
 * Moving the cursor to the element then performing a click seems to be more stable.
 * It also checks if the element is clickable before clicking on it.
 *
 * Also the banner in position fix prevent the driver to click on elements behind it. To avoid this problem, scroll
 * up to the element minus the height of the banner.
 *
 * @method click
 * @static
 * @param {Object} elementFinder The element to click
 * @param {Number} [delay] The delay in milliseconds to wait before clicking on the element
 * @return {Promise} Promise resolving when element is clicked
 */
module.exports.click = function(elementFinder, delay) {
  return browser.waitForAngular().then(function() {
    return elementFinder.getLocation();
  }).then(function(coordinates) {
    var pageElement = element(by.id('page-content-wrapper'));
    var script = 'arguments[0].scrollTop = ' + Math.max(coordinates.y - 50, 0) + ';';

    browser.executeScript(script, pageElement.getWebElement());
    return elementFinder.getTagName();
  }).then(function(tagName) {

    // Select options clicks are automatic, clicking on the option element will automatically perform several
    // actions : Moving to select element, clicking on the select element, moving to option element and
    // clicking on the action element
    if (tagName === 'option')
      return elementFinder.click();
    else {
      browser.wait(protractor.ExpectedConditions.elementToBeClickable(elementFinder), 1000, 'Element is not clickable');
      browser.actions().mouseMove(elementFinder).perform();
      browser.waitForAngular();

      if (delay)
        browser.sleep(delay);

      return browser.actions().click().perform();
    }
  });
};

/**
 * Sets browser's size.
 *
 * @example
 * var browserAPI = require('@openveo/test').e2e.browser;
 * browserAPI.setSize(800, 600);
 *
 * @method setSize
 * @static
 * @param {Number} width The browser width in px
 * @param {Number} height The browser height in px
 * @return {Promise} Promise resolving when the browser size is set
 */
module.exports.setSize = function(width, height) {
  return browser.driver.manage().window().setSize(width, height);
};

/**
 * Sets process.protractorConf to the configuration of the actual capability.
 *
 * @example
 * var browserAPI = require('@openveo/test').e2e.browser;
 * browserAPI.init();
 *
 * @method init
 * @static
 * @return {Promise} Promise resolving when init is done
 */
module.exports.init = function() {
  return browser.getProcessedConfig().then(function(conf) {
    process.protractorConf = conf;
  });
};

/**
 * Disables all animations.
 *
 * @example
 * var browserAPI = require('@openveo/test').e2e.browser;
 * browserAPI.deactivateAnimations();
 *
 * @method deactivateAnimations
 * @static
 */
module.exports.deactivateAnimations = function() {
  var disableCssAnimate = function() {
    angular.module('disableCssAnimate', []).run(function() {
      var style = document.createElement('style');
      style.type = 'text/css';
      style.innerHTML = '* {' +
        '-webkit-transition: none !important;' +
        '-moz-transition: none !important;' +
        '-o-transition: none !important;' +
        '-ms-transition: none !important;' +
        'transition: none !important;' +
      '}';
      document.getElementsByTagName('head')[0].appendChild(style);
    });
  };

  browser.addMockModule('disableCssAnimate', disableCssAnimate);
};

/**
 * Takes a screenshot of the actual browser state.
 *
 * @example
 * var browserAPI = require('@openveo/test').e2e.browser;
 * browserAPI.takeScreenshot('/tmp', 'myScreenshot');
 *
 * @method takeScreenshot
 * @static
 * @param {String} file The screenshot file path
 * @param {String} fileName The screenshot file name without the extension
 * @return {Promise} Promise resolving when the capture is made
 */
module.exports.takeScreenshot = function(filePath, fileName) {
  return browser.takeScreenshot().then(function(png) {
    var deferred = protractor.promise.defer();

    openVeoAPI.fileSystem.mkdir(filePath, function(error) {
      if (!error)
        writeScreenShot(png, path.join(filePath, fileName + '.png'), function(error) {
          if (error)
            deferred.reject(error);
          else
            deferred.fulfill();
        });
    });

    return browser.waitForAngular().then(function() {
      return browser.controlFlow().execute(function() {
        return deferred.promise;
      });
    });
  });
};

/**
 * Gets property of an element.
 *
 * @example
 * var browserAPI = require('@openveo/test').e2e.browser;
 * browserAPI.getProperty(element(by.css('input[type=checkbox]')), 'checked').then(function(isChecked) {
 *   console.log('Checkbox is checked');
 * });
 *
 * @method getProperty
 * @static
 * @param {Object} elementFinder The finder of the element to get property from
 * @param {String} property The property of the element to get value from
 * @return {Promise} Promise resolving with the value of the property
 */
module.exports.getProperty = function(elementFinder, property) {
  return browser.executeScript('return arguments[0][arguments[1]];', elementFinder.getWebElement(), property);
};

/**
 * Tests if an element is visible.
 *
 * An element is considered visible when it exists, is visible and has a non zero height.
 *
 * @method isVisible
 * @static
 * @param {Object} elementFinder The finder of the element to test
 * @return {Promise} Promise resolving with true if the element is visible, false otherwise
 */
module.exports.isVisible = function(elementFinder) {
  return elementFinder.isPresent().then(function(isPresent) {
    if (!isPresent) return protractor.promise.fulfilled(false);

    return elementFinder.isDisplayed().then(function(isDisplayed) {
      if (!isDisplayed) return protractor.promise.fulfilled(false);

      return browser.executeScript(
        'return arguments[0].getBoundingClientRect().height > 0;',
        elementFinder.getWebElement()
      );
    });
  });
};
