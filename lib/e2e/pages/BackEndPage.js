'use strict';

/**
 * @module e2e/pages/BackEndPage
 */

var util = require('util');
var openVeoApi = require('@openveo/api');
var Page = process.requireTest('lib/e2e/pages/Page.js');
var Field = process.requireTest('lib/e2e/fields/Field.js');
var browserExt = process.requireTest('lib/e2e/browser.js');
var i18n = process.requireTest('lib/e2e/i18n.js');
var users = process.requireTest('lib/e2e/users.json');

// List of available languages
var languages = [
  {
    code: 'en',
    translationCode: 'ENGLISH'
  },
  {
    code: 'fr',
    translationCode: 'FRENCH'
  }
];

/**
 * Defines a back end page to help writing end to end tests on OpenVeo back end pages.
 *
 * Do not use this directly but extend it.
 *
 * @example
 * var BackEndPage = require('@openveo/test').e2e.pages.BackEndPage;
 *
 * function MyBackEndPage() {
 *   MyBackEndPage.super_.call(this);
 *   this.path = 'be/myBackEndPage';
 * }
 *
 * module.exports = MyBackEndPage;
 * util.inherits(MyBackEndPage, BackEndPage);
 *
 * var page = new MyBackEndPage();
 * page.logAsAdmin();
 * page.load().then(function() {
 *   console.log('Page fully loaded in the first language of the list of languages');
 * });
 *
 * @class BackEndPage
 * @extends module:e2e/pages/Page~Page
 * @constructor
 */
function BackEndPage() {
  BackEndPage.super_.call(this);

  Object.defineProperties(this,

    /** @lends module:e2e/pages/BackEndPage~BackEndPage */
    {

      /**
       * List of alert elements.
       *
       * @type {Object}
       * @instance
       * @readonly
       */
      alertElements: {value: element.all(by.css('.alert'))},

      /**
       * Popover element.
       *
       * @type {Object}
       * @instance
       * @readonly
       */
      popoverElement: {value: element(by.css('.popover'))},

      /**
       * Button to toggle left menu.
       *
       * @type {Object}
       * @instance
       * @readonly
       */
      toggleLeftMenuLinkElement: {value: element(by.css('.navbar-header button'))},

      /**
       * Left menu wrapper element.
       *
       * Displayed or not as the left menu is opened or not.
       *
       * @type {Object}
       * @instance
       * @readonly
       */
      leftMenuElement: {value: element(by.id('sidebar-wrapper'))},

      /**
       * Profile link element.
       *
       * @type {Object}
       * @instance
       * @readonly
       */
      profileLinkElement: {value: element(by.css('.nav a[href="profile"]'))},

      /**
       * Language link element to open the list of languages.
       *
       * @type {Object}
       * @instance
       * @readonly
       */
      languageLinkElement: {value: element(by.css('.nav .language > a'))},

      /**
       * Logout link element.
       *
       * @type {Object}
       * @instance
       * @readonly
       */
      logoutLinkElement: {value: element(by.css('.nav a[href="logout"]'))},

      /**
       * List of first level link elements in left menu.
       *
       * @type {Object}
       * @instance
       * @readonly
       */
      level1MenuLinkElements: {value: element.all(by.css('#sidebar-wrapper > ul > li'))},

      /**
       * List of back end translations.
       *
       * @type {Object}
       * @instance
       */
      translations: {value: null, writable: true}

    }

  );
}

module.exports = BackEndPage;
util.inherits(BackEndPage, Page);

/**
 * Looks for a menu item and click on it.
 *
 * This will look for the item in menu and sub menus to find the item by its name.
 *
 * @method clickMenuRecursive
 * @private
 * @memberof module:e2e/pages/BackEndPage~BackEndPage
 * @this module:e2e/pages/BackEndPage~BackEndPage
 * @param {Object} elements Menu items elements
 * @param {String} itemName Name of the menu item to look for
 * @return {Promise} A promise resolving when the menu item is clicked
 */
function clickMenuRecursive(elements, itemName) {
  var self = this;
  var deferred = protractor.promise.defer();
  var found = false;

  // Iterate through menu items
  elements.each(function(menuItem, index) {

    // Get menu item link
    var menuLink = menuItem.element(by.xpath('./a'));

    // Get menu item text
    return menuLink.getText().then(function(text) {
      if (found) return protractor.promise.fulfilled();
      if (text === itemName) {

        // Found the expected menu item
        found = true;

        // Click on the menu item
        return browserExt.click(menuItem);

      } else {

        // Menu item does not correspond to the searched one
        // Try in item sub menu (if any)

        var subMenu = menuItem.element(by.css('.sub-menu'));
        return subMenu.isPresent().then(function(isPresent) {
          if (isPresent) {

            // Got a sub menu for this item

            return browserExt.isVisible(subMenu).then(function(isVisible) {
              if (!isVisible) {

                // Open sub menu
                browserExt.click(menuLink);

                // Wait for sub menu to be opened
                browser.wait(self.EC.visibilityOf(subMenu), 5000, 'Missing sub menu');

              }

              // Looks for the searched item in the sub menu
              return clickMenuRecursive.call(self, menuItem.all(by.css('.sub-menu > li')), itemName).then(function() {
                found = true;
              }).catch(function(error) {

                // Do not catch sub errors

              });
            });
          }
        });
      }
    });

  }).then(function() {
    if (found)
      deferred.fulfill();
    else
      deferred.reject(new Error('Item "' + itemName + '" not found'));
  }).catch(function(error) {
    deferred.reject(error);
  });

  return deferred.promise;
}

/**
 * Loads the page and select the first available language.
 *
 * This will automatically select the first language in the list of available languages.
 *
 * @example
 * var BackEndPage = require('@openveo/test').e2e.pages.BackEndPage;
 *
 * function MyBackEndPage() {
 *   MyBackEndPage.super_.call(this);
 *   this.path = 'be/myBackEndPage';
 * }
 *
 * module.exports = MyBackEndPage;
 * util.inherits(MyBackEndPage, BackEndPage);
 *
 * var page = new MyBackEndPage();
 * page.logAsAdmin();
 * page.load().then(function() {
 *   console.log('Page fully loaded in the first language');
 * });
 *
 * @return {Promise} Promise resolving when the page is loaded and language changed
 */
BackEndPage.prototype.load = function() {
  var self = this;

  return Page.prototype.load.call(this).then(function() {
    return self.selectLanguage(languages[0]);
  });

};

/**
 * Sets page language.
 *
 * It uses the top menu to change the language, a page reload will be performed.
 *
 * @example
 * // With MyBackEndPage extending BackEndPage
 * var page = new MyBackEndPage();
 * var languages = page.getLanguages();
 *
 * page.logAsAdmin();
 * page.selectLanguage(languages[1]).then(function() {
 *   console.log('Page reloaded in french');
 * });
 *
 * @param {Object} language The language to load
 * @return {Promise} Promise resolving when the page is reloaded with the expected language
 */
BackEndPage.prototype.selectLanguage = function(language) {
  var self = this;

  // Save language
  this.language = language;

  // Click on the languages link
  return browserExt.click(this.languageLinkElement).then(function() {

    // Get language link
    var languageOptionLink = self.getLanguageOption(self.language.code);

    // Click on the language
    browserExt.click(languageOptionLink, 1000);

    // Page has been reloaded but without mock modules
    // Wait for page to be loaded and reload with mock modules
    browser.driver.wait(
      self.EC.visibilityOf(self.toggleLeftMenuLinkElement),
      5000,
      'Missing menu link after selecting a language'
    );

    // Wait for page to be reloaded
    return Page.prototype.load.call(self);

  }).then(function() {

    // Get back end translations
    return i18n.getBackEndTranslations(self.language.code);

  }).then(function(backEndTranslations) {
    self.translations = backEndTranslations;
  }).then(function() {
    return protractor.promise.fulfilled();
  });
};

/**
 * Gets language link element.
 *
 * @example
 * // With MyBackEndPage extending BackEndPage
 * var page = new MyBackEndPage();
 * page.click(page.getLanguageOption('fr')).then(function() {
 *   console.log('Page is now in french');
 * });
 *
 * @param {String} languageCode The language code to load (e.g. en)
 * @return {Object} The language option element
 */
BackEndPage.prototype.getLanguageOption = function(languageCode) {
  return element(by.css('.nav .language li > .' + languageCode));
};

/**
 * Authenticates to the back end using the given account.
 *
 * If an account is already logged in, it will be logged out.
 *
 * @example
 * var user = {
 *   "email": "some-user@veo-labs.com",
 *   "password": "some-user"
 * }
 *
 * // With MyBackEndPage extending BackEndPage
 * var page = new MyBackEndPage();
 * page.logAs(user).then(function() {
 *   console.log('Logged as some-user');
 * });
 *
 * @param {Object} user Information about the user
 * @return {Promise} Promise resolving when authenticated to the back end
 */
BackEndPage.prototype.logAs = function(user) {
  var self = this;

  // Logout any connected user
  return self.logout().then(function() {

    // Login page elements
    var userInput = element(by.model('userLogin'));
    var passwordInput = element(by.model('password'));
    var button = element(by.binding('LOGIN.SUBMIT'));

    // Wait for login fields and submit button to be present
    browser.wait(self.EC.and(
      self.EC.visibilityOf(userInput),
      self.EC.visibilityOf(passwordInput),
      self.EC.visibilityOf(button)), 5000, 'Missing one or several login fields');

    // Fill the formular with user information
    Field.setInputValue(userInput, user.email);
    Field.setInputValue(passwordInput, user.password);

    // Submit formular
    return browserExt.click(button).then(function() {
      self.user = user;
      browser.wait(self.EC.visibilityOf(self.toggleLeftMenuLinkElement), 5000, 'Missing left menu toggle button');
      return protractor.promise.fulfilled();
    });

  });
};

/**
 * Authenticates to the back end using the given CAS account.
 *
 * cas-server-mock module must be used for this to work.
 * Also process.protractorConf.casConf.userIdAttribute should be set to the name of the CAS user attribute
 * which must be used as user's login.
 * If an account is already logged in, it will be logged out.
 *
 * @example
 * var user =   {
 *   name: 'test',
 *   attributes: {
 *     name: 'test',
 *     mail: 'test@openveo.com',
 *     groups: ['test-group1', 'test-group2']
 *   }
 * };
 *
 * // With MyBackEndPage extending BackEndPage
 * var page = new MyBackEndPage();
 * page.logToCasAs(user).then(function() {
 *   console.log('Logged as test');
 * });
 *
 * @param {Object} user Information about the CAS user
 * @return {Promise} Promise resolving when authenticated to the back end
 */
BackEndPage.prototype.logToCasAs = function(user) {
  var self = this;

  // Logout any connected user
  return self.logout().then(function() {
    var userIdAttribute = process.protractorConf.casConf.userIdAttribute;

    // CAS button on login page and input with submit button on CAS page
    var casButtonFinder = element(by.css('.ov-cas-button > a'));
    var loginFieldFinder = element(by.model('ctrl.login'));
    var submitButtonFinder = element(by.css('input[type="submit"]'));

    // Click on CAS button from login page
    casButtonFinder.click();

    // Submit login informations on CAS page
    loginFieldFinder.sendKeys(openVeoApi.util.evaluateDeepObjectProperties(userIdAttribute, user));
    submitButtonFinder.click().then(function() {
      self.user = user;
      browser.wait(self.EC.visibilityOf(self.toggleLeftMenuLinkElement), 5000, 'Missing left menu toggle button');
      return protractor.promise.fulfilled();
    });

  });
};

/**
 * Authenticates to the back end using the given LDAP account.
 *
 * process.protractorConf.ldapConf.userIdAttribute should be set to the name of the LDAP user attribute
 * which must be used as user's login.
 * If an account is already logged in, it will be logged out.
 *
 * @example
 * var user = {
 *   dn: 'cn=test,dc=test',
 *   cn: 'test',
 *   groups: 'test-group1,test-group2',
 *   mail: 'test@openveo.com'
 * };
 *
 * // With MyBackEndPage extending BackEndPage
 * var page = new MyBackEndPage();
 * page.logToLdapAs(user).then(function() {
 *   console.log('Logged as test');
 * });
 *
 * @param {Object} user Information about the LDAP user
 * @return {Promise} Promise resolving when authenticated to the back end
 */
BackEndPage.prototype.logToLdapAs = function(user) {
  var self = this;

  // Logout any connected user
  return self.logout().then(function() {
    var userIdAttribute = process.protractorConf.ldapConf.userIdAttribute;

    // Login page elements
    var userInputFinder = element(by.model('userLogin'));
    var passwordInputFinder = element(by.model('password'));
    var buttonFinder = element(by.binding('LOGIN.SUBMIT'));

    // Fill the formular with user information
    // Password is not important here, it could by anything
    userInputFinder.sendKeys(openVeoApi.util.evaluateDeepObjectProperties(userIdAttribute, user));
    passwordInputFinder.sendKeys('something');

    // Submit formular
    return browserExt.click(buttonFinder).then(function() {
      self.user = user;
      browser.wait(self.EC.visibilityOf(self.toggleLeftMenuLinkElement), 5000, 'Missing left menu toggle button');
      return protractor.promise.fulfilled();
    });

  });
};

/**
 * Logs to the back end using the super administrator account.
 *
 * The super administrator can perform any actions.
 * If an account is already logged in, it will be logged out.
 *
 * @example
 * // With MyBackEndPage extending BackEndPage
 * var page = new MyBackEndPage();
 * page.logAsAdmin().then(function() {
 *   console.log('Logged as super admin');
 * });
 *
 * @return {Promise} Promise resolving when authenticated as the super administrator
 */
BackEndPage.prototype.logAsAdmin = function() {
  return this.logAs(users.testSuperAdmin);
};

/**
 * Gets current logged in user.
 *
 * @example
 * // With MyBackEndPage extending BackEndPage
 * var page = new MyBackEndPage();
 * page.logAsAdmin().then(function() {
 *   console.log(page.getUser());
 * });
 *
 * @return {Object} The current logged in user
 */
BackEndPage.prototype.getUser = function() {
  return this.user;
};

/**
 * Logs out current authenticated user.
 *
 * This will lead to the login page.
 *
 * @example
 * // With MyBackEndPage extending BackEndPage
 * var page = new MyBackEndPage();
 * page.logAsAdmin();
 * page.logout().then(function() {
 *   console.log('Logged out');
 * });
 *
 * @return {Promise} Promise resolving when user is logged out and login page is displayed
 */
BackEndPage.prototype.logout = function() {
  var self = this;

  // Load login page
  return browser.get('be/login').then(function() {
    return browser.getCurrentUrl();
  }).then(function(currentUrl) {
    if (currentUrl === process.protractorConf.baseUrl + 'be/login') {

      // Current page is already the login page thus user is already logged out
      return protractor.promise.fulfilled();

    } else {

      // User is connected, logout
      return browserExt.click(self.logoutLinkElement).then(function() {
        self.user = null;

        // Login page elements
        var userInput = element(by.model('userLogin'));
        var passwordInput = element(by.model('password'));
        var button = element(by.binding('LOGIN.SUBMIT'));

        // Waits for login page to be present
        return browser.wait(
          self.EC.and(
            self.EC.visibilityOf(userInput),
            self.EC.visibilityOf(passwordInput),
            self.EC.visibilityOf(button)
          ),
          5000,
          'Missing one or several login fields'
        );

      });
    }
  }).then(function() {
    return protractor.promise.fulfilled();
  });
};

/**
 * Gets the list of available languages.
 *
 * @example
 * // With MyBackEndPage extending BackEndPage
 * var page = new MyBackEndPage();
 * console.log(page.getLanguages());
 *
 * @return {Array} The list of available languages
 */
BackEndPage.prototype.getLanguages = function() {
  return languages;
};

/**
 * Gets level 1 menu items.
 *
 * All level 1 menu items will be returned with the promise unless itemName is specified then all elements
 * corresponding to the item name will be returned.
 *
 * @example
 * // With MyBackEndPage extending BackEndPage
 * var page = new MyBackEndPage();
 * page.logAsAdmin();
 * page.getLevel1MenuItems('Rights').then(function(elements) {
 *   console.log(elements);
 * });
 *
 * @param {String} [itemName] The translated name of the menu item to look for, leave empty to get all
 * level 1 menu items
 * @return {Promise} Promise resolving with the list of elements
 */
BackEndPage.prototype.getLevel1MenuItems = function(itemName) {
  var self = this;

  return this.openMenu().then(function() {
    var deferred = protractor.promise.defer();

    self.level1MenuLinkElements.filter(function(menuLink, index) {
      return menuLink.element(by.xpath('./a')).getText().then(function(text) {
        return (itemName === text || !itemName);
      });
    }).then(function(items) {
      deferred.fulfill(items);
    }, function(error) {
      deferred.reject(error);
    });

    return deferred.promise;
  });
};

/**
 * Gets level 2 menu items.
 *
 * All level 2 menu items will be returned with the promise unless itemName is specified then all elements
 * corresponding to the item name will be returned.
 *
 * @example
 * // With MyBackEndPage extending BackEndPage
 * var page = new MyBackEndPage();
 * page.logAsAdmin();
 * page.getLevel2MenuItems('Rights', 'Users').then(function(elements) {
 *   console.log(elements);
 * });
 *
 * @param {String} level1ItemName The translated name of the first level menu item to look for
 * @param {String} [level2ItemName] The translated name of the second menu item to look for, leave empty to get all
 * level 2 menu items
 * @return {Promise} Promise resolving with the list of elements
 */
BackEndPage.prototype.getLevel2MenuItems = function(level1ItemName, level2ItemName) {
  var self = this;
  var level1MenuItem;

  return self.getLevel1MenuItems(level1ItemName).then(function(level1MenuItems) {
    if (level1MenuItems.length) {
      level1MenuItem = level1MenuItems[0];
      return self.openSubMenu(level1ItemName);
    } else
      return protractor.promise.rejected(new Error('Menu item ' + level1ItemName + ' not found'));
  }).then(function() {
    var deferred = protractor.promise.defer();
    level1MenuItem.all(by.css('.sub-menu > li')).filter(function(menuLink, index) {
      return menuLink.element(by.xpath('./a')).getText().then(function(text) {
        return (level2ItemName === text || !level2ItemName);
      });
    }).then(function(items) {
      deferred.fulfill(items);
    }, function(error) {
      deferred.reject(error);
    });

    return deferred.promise;
  });
};

/**
 * Opens left menu.
 *
 * @example
 * // With MyBackEndPage extending BackEndPage
 * var page = new MyBackEndPage();
 * page.logAsAdmin();
 * page.openMenu().then(function() {
 *   console.log('Left menu opened');
 * });
 *
 * @return {Promise} Promise resolving when left menu is opened
 */
BackEndPage.prototype.openMenu = function() {
  var self = this;

  return this.leftMenuElement.isDisplayed().then(function(isDisplayed) {
    if (!isDisplayed) {

      // Open menu
      browserExt.click(self.toggleLeftMenuLinkElement);

      return browser.wait(self.EC.visibilityOf(self.leftMenuElement), 1000, 'Missing left menu');
    } else {

      // Menu is already displayed
      return protractor.promise.fulfilled();

    }
  }).then(function() {
    return protractor.promise.fulfilled();
  });
};

/**
 * Closes menu.
 *
 * @example
 * // With MyBackEndPage extending BackEndPage
 * var page = new MyBackEndPage();
 * page.logAsAdmin();
 * page.closeMenu().then(function() {
 *   console.log('Left menu closed');
 * });
 *
 * @return {Promise} Promise resolving when menu is closed
 */
BackEndPage.prototype.closeMenu = function() {
  var self = this;

  return this.leftMenuElement.isDisplayed().then(function(isDisplayed) {
    if (isDisplayed) {

      // Close menu
      browserExt.click(self.toggleLeftMenuLinkElement);

      // Wait for the menu to be invisible
      return browser.wait(self.EC.invisibilityOf(self.leftMenuElement), 1000, 'Menu still visible');
    } else {

      // Menu is already closed
      return protractor.promise.fulfilled();

    }
  }).then(function() {
    return protractor.promise.fulfilled();
  });
};

/**
 * Opens an item sub menu.
 *
 * @example
 * // With MyBackEndPage extending BackEndPage
 * var page = new MyBackEndPage();
 * page.logAsAdmin();
 * page.openSubMenu('Rights').then(function() {
 *   console.log('Rights sub menu opened');
 * });
 *
 * @param {String} itemName The name of the menu item
 * @return {Promise} Promise resolving when sub menu is opened
 */
BackEndPage.prototype.openSubMenu = function(itemName) {
  var self = this;
  var menuItem;
  var subMenu;

  return this.leftMenuElement.isDisplayed().then(function(isDisplayed) {
    if (!isDisplayed)
      self.openMenu();

    // Find menu item element
    return self.getLevel1MenuItems(itemName);
  }).then(function(menuItems) {
    menuItem = menuItems[0];
    subMenu = menuItem.element(by.css('.sub-menu'));
    return subMenu.isDisplayed();
  }).then(function(isSubMenuDisplayed) {
    if (isSubMenuDisplayed) {

      // Sub menu is already displayed
      return protractor.promise.fulfilled();

    } else {

      // Click on menu item
      browserExt.click(menuItem.element(by.xpath('./a')));

      // Wait for the sub menu to be visible
      return browser.wait(self.EC.visibilityOf(subMenu), 1000, 'Missing sub menu');

    }
  }).then(function() {
    return protractor.promise.fulfilled();
  });
};

/**
 * Tests if a sub menu is opened.
 *
 * @example
 * // With MyBackEndPage extending BackEndPage
 * var page = new MyBackEndPage();
 * page.logAsAdmin();
 * page.isSubMenuOpened('Rights').then(function(isOpened) {
 *   console.log('Is sub menu opened ?' + isOpened);
 * });
 *
 * @param {String} itemName The name of the menu item
 * @return {Promise} Promise resolving with true if the sub menu is opened, false if it's closed
 */
BackEndPage.prototype.isSubMenuOpened = function(itemName) {
  var self = this;

  return this.leftMenuElement.isDisplayed().then(function(isDisplayed) {
    if (!isDisplayed)
      self.openMenu();

    // Find menu item element
    return self.getLevel1MenuItems(itemName);
  }).then(function(menuItems) {
    return menuItems[0].element(by.css('.sub-menu')).isDisplayed();
  });
};

/**
 * Closes an item sub menu by its name.
 *
 * @example
 * // With MyBackEndPage extending BackEndPage
 * var page = new MyBackEndPage();
 * page.logAsAdmin();
 * page.closeSubMenu('Rights').then(function() {
 *   console.log('Rights sub menu closed');
 * });
 *
 * @param {String} itemName The name of the menu item having a sub menu
 * @return {Promise} Promise resolving when sub menu is closed
 */
BackEndPage.prototype.closeSubMenu = function(itemName) {
  var self = this;

  return this.leftMenuElement.isDisplayed().then(function(isDisplayed) {

    if (!isDisplayed) {

      // Menu is already closed, thus sub menu is also closed
      return protractor.promise.fulfilled();

    } else {

      // Find menu item element
      return self.getLevel1MenuItems(itemName).then(function(menuItems) {
        var menuItem = menuItems[0];
        var subMenu = menuItem.element(by.css('.sub-menu'));

        return subMenu.isDisplayed().then(function(isSubMenuDisplayed) {

          if (!isSubMenuDisplayed) {

            // Sub menu is already closed
            return protractor.promise.fulfilled();

          } else {

            // Click on menu item
            browserExt.click(menuItem.element(by.xpath('./a')));

            // Wait for the sub menu to be invisible
            return browser.wait(self.EC.invisibilityOf(subMenu), 1000, 'Sub menu still visible');

          }

        });

      });

    }

  }).then(function() {
    return protractor.promise.fulfilled();
  });
};

/**
 * Clicks on a menu item.
 *
 * This will look for the item in menu and sub menus to find the item by its name.
 *
 * @example
 * // With MyBackEndPage extending BackEndPage
 * var page = new MyBackEndPage();
 * page.logAsAdmin();
 * page.clickMenu('Roles').then(function() {
 *   console.log('Roles menu item clicked');
 * });
 *
 * @param {String} itemName The name of the menu item
 * @return {Promise} Promise resolving when menu is clicked
 */
BackEndPage.prototype.clickMenu = function(itemName) {
  var self = this;

  return this.leftMenuElement.isDisplayed().then(function(isDisplayed) {
    if (!isDisplayed)
      self.openMenu();

    return clickMenuRecursive.call(self, self.level1MenuLinkElements, itemName);
  });
};

/**
 * Clicks on profile link.
 *
 * @example
 * // With MyBackEndPage extending BackEndPage
 * var page = new MyBackEndPage();
 * page.logAsAdmin();
 * page.clickProfile().then(function() {
 *   console.log('Profile link clicked');
 * });
 *
 * @return {Promise} Promise resolving when profile link is clicked
 */
BackEndPage.prototype.clickProfile = function() {
  return browserExt.click(this.profileLinkElement);
};

/**
 * Closes all alerts.
 *
 * @example
 * // With MyBackEndPage extending BackEndPage
 * var page = new MyBackEndPage();
 * page.logAsAdmin();
 * page.closeAlerts().then(function() {
 *   console.log('All alerts closed');
 * });
 *
 * @return {Promise} Promise resolving when all alerts are closed
 */
BackEndPage.prototype.closeAlerts = function() {
  var self = this;

  return browser.waitForAngular().then(function() {
    var deferred = protractor.promise.defer();

    self.alertElements.each(function(alertElement, index) {
      browserExt.click(alertElement.element(by.css('button')));
    }).then(function() {
      deferred.fulfill();
    });

    return deferred.promise;

  });
};

/**
 * Gets all alert messages.
 *
 * @example
 * // With MyBackEndPage extending BackEndPage
 * var page = new MyBackEndPage();
 * page.logAsAdmin();
 * page.getAlertMessages().then(function(messages) {
 *   console.log(messages);
 * });
 *
 * @return {Promise} Promise resolving with all alert messages
 */
BackEndPage.prototype.getAlertMessages = function() {
  var self = this;

  return browser.waitForAngular().then(function() {
    var deferred = protractor.promise.defer();
    var messages = [];

    self.alertElements.each(function(alertElement, index) {
      alertElement.element(by.binding('alert.msg')).getText().then(function(message) {
        messages.push(message);
      });
    }).then(function() {
      deferred.fulfill(messages);
    });

    return deferred.promise;
  });
};
