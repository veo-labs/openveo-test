'use strict';

/**
 * @module e2e
 */

var util = require('util');
var Page = process.requireTest('lib/e2e/pages/Page.js');
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
 *
 *     var BackEndPage = require('@openveo/test').e2e.pages.BackEndPage;
 *
 *     function MyBackEndPage() {
 *       MyBackEndPage.super_.call(this);
 *       this.path = 'be/myBackEndPage';
 *     }
 *
 *     module.exports = MyBackEndPage;
 *     util.inherits(MyBackEndPage, BackEndPage);
 *
 *     var page = new MyBackEndPage();
 *     page.logAsAdmin();
 *     page.load().then(function() {
 *       console.log('Page fully loaded in the first language of the list of languages');
 *     });
 *
 * @class BackEndPage
 * @extends Page
 * @constructor
 */
function BackEndPage() {
  BackEndPage.super_.call(this);

  Object.defineProperties(this, {

    /**
     * List of alert elements.
     *
     * @property alertElements
     * @type ElementArrayFinder
     * @final
     */
    alertElements: {value: element.all(by.css('.alert'))},

    /**
     * Popover element.
     *
     * @property popoverElement
     * @type ElementFinder
     * @final
     */
    popoverElement: {value: element(by.css('.popover'))},

    /**
     * Button to toggle left menu.
     *
     * @property toggleLeftMenuLinkElement
     * @type ElementFinder
     * @final
     */
    toggleLeftMenuLinkElement: {value: element(by.css('.navbar-header button'))},

    /**
     * Left menu wrapper element.
     *
     * Displayed or not as the left menu is opened or not.
     *
     * @property leftMenuElement
     * @type ElementFinder
     * @final
     */
    leftMenuElement: {value: element(by.id('sidebar-wrapper'))},

    /**
     * Profile link element.
     *
     * @property profileLinkElement
     * @type ElementFinder
     * @final
     */
    profileLinkElement: {value: element(by.css('.nav a[href="profile"]'))},

    /**
     * Language link element to open the list of languages.
     *
     * @property languageLinkElement
     * @type ElementFinder
     * @final
     */
    languageLinkElement: {value: element(by.css('.nav .language > a'))},

    /**
     * Logout link element.
     *
     * @property logoutLinkElement
     * @type ElementFinder
     * @final
     */
    logoutLinkElement: {value: element(by.css('.nav a[href="logout"]'))},

    /**
     * List of first level link elements in left menu.
     *
     * @property level1MenuLinkElements
     * @type ElementArrayFinder
     * @final
     */
    level1MenuLinkElements: {value: element.all(by.css('#sidebar-wrapper > ul > li'))},

    /**
     * List of back end translations.
     *
     * @property translations
     * @type Object
     */
    translations: {value: null, writable: true}

  });
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
 * @param {ElementArrayFinder} elements Menu items elements
 * @param {itemName} itemName Name of the menu item to look for
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

            // Open sub menu
            browserExt.click(menuLink);

            // Wait for sub menu to be opened
            browser.wait(self.EC.visibilityOf(subMenu), 5000, 'Missing sub menu');

            // Looks for the searched item in the sub menu
            return clickMenuRecursive.call(self, menuItem.all(by.css('.sub-menu > li')), itemName).then(function() {
              found = true;
            }).catch(function(error) {

              // Do not catch sub errors

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
 *
 *     var BackEndPage = require('@openveo/test').e2e.pages.BackEndPage;
 *
 *     function MyBackEndPage() {
 *       MyBackEndPage.super_.call(this);
 *       this.path = 'be/myBackEndPage';
 *     }
 *
 *     module.exports = MyBackEndPage;
 *     util.inherits(MyBackEndPage, BackEndPage);
 *
 *     var page = new MyBackEndPage();
 *     page.logAsAdmin();
 *     page.load().then(function() {
 *       console.log('Page fully loaded in the first language');
 *     });
 *
 * @method load
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
 *
 *     // With MyBackEndPage extending BackEndPage
 *     var page = new MyBackEndPage();
 *     var languages = page.getLanguages();
 *
 *     page.logAsAdmin();
 *     page.selectLanguage(languages[1]).then(function() {
 *       console.log('Page reloaded in french');
 *     });
 *
 * @method selectLanguage
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

    // Wait for page to be reloaded
    Page.prototype.load.call(self);

    // Wait for page to be fully loaded
    return self.onLoaded();
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
 *
 *     // With MyBackEndPage extending BackEndPage
 *     var page = new MyBackEndPage();
 *     page.click(page.getLanguageOption('fr')).then(function() {
 *       console.log('Page is now in french');
 *     });
 *
 * @method getLanguageOption
 * @param {String} languageCode The language code to load (e.g. en)
 * @return {ElementFinder} The language option element
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
 *
 *     var user = {
 *       "email": "some-user@veo-labs.com",
 *       "password": "some-user"
 *     }
 *
 *     // With MyBackEndPage extending BackEndPage
 *     var page = new MyBackEndPage();
 *     page.logAs(user).then(function() {
 *       console.log('Logged as some-user');
 *     });
 *
 * @method logAs
 * @param {Object} user Information about the user
 * @return {Promise} Promise resolving when authenticated to the back end
 */
BackEndPage.prototype.logAs = function(user) {
  var self = this;

  // Logout any connected user
  return self.logout().then(function() {

    // Login page elements
    var userInput = element(by.model('userEmail'));
    var passwordInput = element(by.model('password'));
    var button = element(by.binding('LOGIN.SUBMIT'));

    // Waits for login fields and submit button to be present
    browser.wait(self.EC.and(
      self.EC.visibilityOf(userInput),
      self.EC.visibilityOf(passwordInput),
      self.EC.visibilityOf(button)), 5000, 'Missing one or several login fields');

    // Fill the formular with user information
    userInput.sendKeys(user.email);
    passwordInput.sendKeys(user.password);

    // Submit formular
    return browserExt.click(button).then(function() {
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
 * If an account is already logged in, it will be logged out. Super administrator is also locked.
 *
 * @example
 *
 *     // With MyBackEndPage extending BackEndPage
 *     var page = new MyBackEndPage();
 *     page.logAsAdmin().then(function() {
 *       console.log('Logged as super admin');
 *     });
 *
 * @method logAsAdmin
 * @return {Promise} Promise resolving when authenticated as the super administrator
 */
BackEndPage.prototype.logAsAdmin = function() {
  return this.logAs(users.testSuperAdmin);
};

/**
 * Gets current logged in user.
 *
 * @example
 *
 *     // With MyBackEndPage extending BackEndPage
 *     var page = new MyBackEndPage();
 *     page.logAsAdmin().then(function() {
 *       console.log(page.getUser());
 *     });
 *
 * @method getUser
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
 *
 *     // With MyBackEndPage extending BackEndPage
 *     var page = new MyBackEndPage();
 *     page.logAsAdmin();
 *     page.logout().then(function() {
 *       console.log('Logged out');
 *     });
 *
 * @method logout
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
        var userInput = element(by.model('userEmail'));
        var passwordInput = element(by.model('password'));
        var button = element(by.binding('LOGIN.SUBMIT'));

        // Waits for login page to be present
        return browser.wait(self.EC.and(self.EC.visibilityOf(userInput),
                                        self.EC.visibilityOf(passwordInput),
                                        self.EC.visibilityOf(button)), 5000, 'Missing one or several login fields');

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
 *
 *     // With MyBackEndPage extending BackEndPage
 *     var page = new MyBackEndPage();
 *     console.log(page.getLanguages());
 *
 * @method getLanguages
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
 *
 *     // With MyBackEndPage extending BackEndPage
 *     var page = new MyBackEndPage();
 *     page.logAsAdmin();
 *     page.getLevel1MenuItems('Rights').then(function(elements) {
 *       console.log(elements);
 *     });
 *
 * @method getLevel1MenuItems
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
 *
 *     // With MyBackEndPage extending BackEndPage
 *     var page = new MyBackEndPage();
 *     page.logAsAdmin();
 *     page.getLevel2MenuItems('Rights', 'Users').then(function(elements) {
 *       console.log(elements);
 *     });
 *
 * @method getLevel2MenuItems
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
 *
 *     // With MyBackEndPage extending BackEndPage
 *     var page = new MyBackEndPage();
 *     page.logAsAdmin();
 *     page.openMenu().then(function() {
 *       console.log('Left menu opened');
 *     });
 *
 * @method openMenu
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
 *
 *     // With MyBackEndPage extending BackEndPage
 *     var page = new MyBackEndPage();
 *     page.logAsAdmin();
 *     page.closeMenu().then(function() {
 *       console.log('Left menu closed');
 *     });
 *
 * @method closeMenu
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
 *
 *     // With MyBackEndPage extending BackEndPage
 *     var page = new MyBackEndPage();
 *     page.logAsAdmin();
 *     page.openSubMenu('Rights').then(function() {
 *       console.log('Rights sub menu opened');
 *     });
 *
 * @method openSubMenu
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
 *
 *     // With MyBackEndPage extending BackEndPage
 *     var page = new MyBackEndPage();
 *     page.logAsAdmin();
 *     page.isSubMenuOpened('Rights').then(function(isOpened) {
 *       console.log('Is sub menu opened ?' + isOpened);
 *     });
 *
 * @method isSubMenuOpened
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
 *
 *     // With MyBackEndPage extending BackEndPage
 *     var page = new MyBackEndPage();
 *     page.logAsAdmin();
 *     page.closeSubMenu('Rights').then(function() {
 *       console.log('Rights sub menu closed');
 *     });
 *
 * @method closeSubMenu
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
 *
 *     // With MyBackEndPage extending BackEndPage
 *     var page = new MyBackEndPage();
 *     page.logAsAdmin();
 *     page.clickMenu('Roles').then(function() {
 *       console.log('Roles menu item clicked');
 *     });
 *
 * @method clickMenu
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
 *
 *     // With MyBackEndPage extending BackEndPage
 *     var page = new MyBackEndPage();
 *     page.logAsAdmin();
 *     page.clickProfile().then(function() {
 *       console.log('Profile link clicked');
 *     });
 *
 * @method clickProfile
 * @return {Promise} Promise resolving when profile link is clicked
 */
BackEndPage.prototype.clickProfile = function() {
  return browserExt.click(this.profileLinkElement);
};

/**
 * Closes all alerts.
 *
 * @example
 *
 *     // With MyBackEndPage extending BackEndPage
 *     var page = new MyBackEndPage();
 *     page.logAsAdmin();
 *     page.closeAlerts().then(function() {
 *       console.log('All alerts closed');
 *     });
 *
 * @method closeAlerts
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
 *
 *     // With MyBackEndPage extending BackEndPage
 *     var page = new MyBackEndPage();
 *     page.logAsAdmin();
 *     page.getAlertMessages().then(function(messages) {
 *       console.log(messages);
 *     });
 *
 * @method getAlertMessages
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
