'use strict';

/**
 * @module e2e
 */

var url = require('url');

/**
 * Defines a web page to help writing end to end tests with protractor for OpenVeo.
 *
 * Do not use this directly but extend it.
 *
 * @example
 *
 *     var Page = require('@openveo/test').e2e.pages.Page;
 *
 *     function MyPage() {
 *       MyPage.super_.call(this);
 *       this.path = 'be/myPage';
 *     }
 *
 *     module.exports = MyPage;
 *     util.inherits(MyPage, Page);
 *
 *     var page = new MyPage();
 *     page.load().then(function() {
 *       console.log('Page fully loaded');
 *     });
 *
 * @class Page
 * @constructor
 */
function Page() {
  Object.defineProperties(this, {

    /**
     * Protractor expected conditions.
     *
     * @property EC
     * @type ExpectedConditions
     * @final
     */
    EC: {value: protractor.ExpectedConditions},

    /**
     * Protractor control flow.
     *
     * @property flow
     * @type ControlFlow
     * @final
     */
    flow: {value: browser.controlFlow()},

    /**
     * Body element.
     *
     * @property bodyElement
     * @type ElementFinder
     * @final
     */
    bodyElement: {value: element(by.css('body'))},

    /**
     * Page element.
     *
     * Page wrapper holding the content scrollbar.
     *
     * @property pageElement
     * @type ElementFinder
     * @final
     */
    pageElement: {value: element(by.id('page-content-wrapper'))}

  });
}

module.exports = Page;

/**
 * Loads the page.
 *
 * @example
 *
 *     var Page = require('@openveo/test').e2e.pages.Page;
 *
 *     function MyPage() {
 *       MyPage.super_.call(this);
 *       this.path = 'be/myPage';
 *     }
 *
 *     module.exports = MyPage;
 *     util.inherits(MyPage, Page);
 *
 *     var page = new MyPage();
 *     page.load().then(function() {
 *       console.log('Page fully loaded');
 *     });
 *
 * @method load
 * @return {Promise} Promise resolving when the page is fully loaded
 */
Page.prototype.load = function() {
  var self = this;
  var expectedUrl = process.protractorConf.baseUrl + this.path;

  // Load url of the page
  return browser.get(this.path).then(function() {

    // Deactivate animations
    self.bodyElement.allowAnimations(false);

    // Verify if loaded page is the expected one
    return browser.getCurrentUrl().then(function(currentUrl) {
      if (currentUrl.replace(/\/$/, '') !== expectedUrl.replace(/\/$/, ''))
        return protractor.promise.rejected(new Error('Failed loading page ' + expectedUrl +
                                                     ' (got ' + currentUrl + ')'));
      else
        return self.onLoaded();
    });

  }).then(function() {
    return protractor.promise.fulfilled();
  });

};

/**
 * Gets page title as described by the HTMLTitleElement.
 *
 * @example
 *
 *     // With MyPage extending Page
 *     var page = new MyPage();
 *     assert.eventually.equal(page.getTitle(), 'My page title');
 *
 * @method getTitle
 * @return {Promise} Promise resolving with the title of the page
 */
Page.prototype.getTitle = function() {
  return browser.getTitle();
};

/**
 * Removes all cookies on the actual page.
 *
 * @method deleteCookies
 * @return {Promise} Promise resolving when all cookies are deleted
 */
Page.prototype.deleteCookies = function() {
  return browser.driver.manage().deleteAllCookies();
};

/**
 * Sends an http request and return its reponse.
 *
 * This will execute the request from the page.
 *
 * @param {String} path Request's path
 * @param {String} method HTTP method to use
 * @param {Object} data Request's data to send in body
 * @return {Promise} Promise resolving with the request's response
 */
Page.prototype.sendRequest = function(path, method, data, multipart) {
  var url = process.protractorConf.baseUrl + path;

  return browser.executeAsyncScript(function() {
    var callback = arguments[arguments.length - 1];
    var request = {
      url: arguments[0],
      method: arguments[1],
      responseType: 'json'
    };
    if (arguments[3]) {
      request.data = new FormData();
      for (var part in arguments[2]) {
        request.data.append(part, JSON.stringify(arguments[2][part]));
      }
      request.transformRequest = angular.identity;
      request.headers = {'Content-Type': undefined};
    } else {
      request.data = arguments[2];
    }
    var $http = angular.injector(['ng']).get('$http');
    $http(request)
    .then(function(response) {
      callback(response);
    }, function(response) {
      callback(response);
    });
  }, url, method, data, multipart);
};

/**
 * Refreshes actual page.
 *
 * @method refresh
 * @return {Promise} Promise resolving when the page is fully loaded
 */
Page.prototype.refresh = function() {
  var self = this;

  return browser.refresh().then(function() {
    self.bodyElement.allowAnimations(false);
    return self.onLoaded();
  }).then(function() {
    return protractor.promise.fulfilled();
  });
};

/**
 * Handles page loaded.
 *
 * Use this method to perform actions after the page is loaded. Typically, verify that the page is loaded by
 * waiting for elements to be present on the page.
 *
 * By default it does nothing, override it to define your own behaviour.
 *
 * @method onLoaded
 * @return {Promise} Promise resolving when the page is fully loaded
 */
Page.prototype.onLoaded = function() {};


/**
 * Helper Url
 * Get only current url path without host
 *
 * @method getPath
 * @return {Promise} Promise resolving with current path
 */
Page.prototype.getPath = function() {
  return browser.getCurrentUrl().then(function(urlToParse) {
    var urlParsed = url.parse(urlToParse);
    return protractor.promise.fulfilled(urlParsed.path);
  });
};
