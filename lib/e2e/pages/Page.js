'use strict';

/**
 * @module e2e
 */

/**
 * A web page to help writing end to end tests with protractor for OpenVeo.
 *
 * Do not use this directly but extend it.
 *
 * @example
 *
 *     var Page = require('@openveo/test').e2e.Page;
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

  /**
   * Protractor expected conditions.
   *
   * @property EC
   * @type ExpectedConditions
   */
  this.EC = protractor.ExpectedConditions;

  /**
   * Protractor control flow.
   *
   * @property flow
   * @type ControlFlow
   */
  this.flow = browser.controlFlow();

  /**
   * Body element.
   *
   * @property bodyElement
   * @type ElementFinder
   */
  this.bodyElement = element(by.css('body'));

  /**
   * Page element.
   *
   * Page wrapper holding the content scrollbar.
   *
   * @property pageElement
   * @type ElementFinder
   */
  this.pageElement = element(by.id('page-content-wrapper'));
}

module.exports = Page;

/**
 * Loads the page.
 *
 * @example
 *
 *     var Page = require('@openveo/test').e2e.Page;
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
      if (currentUrl.replace(/\/$/, '') !== expectedUrl)
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
Page.prototype.sendRequest = function(path, method, data) {
  var url = process.protractorConf.baseUrl + path;

  return browser.executeAsyncScript(function() {
    var callback = arguments[arguments.length - 1];
    var url = arguments[0];
    var method = arguments[1];
    var data = arguments[2];
    var $http = angular.injector(['ng']).get('$http');
    $http({
      url: url,
      method: method,
      data: data,
      responseType: 'json'
    }).then(function(response) {
      callback(response);
    }, function(response) {
      callback(response);
    });
  }, url, method, data);
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