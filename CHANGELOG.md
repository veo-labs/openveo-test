# 9.0.0 / YYYY-MM-DD

## BREAKING CHANGES

- No longer tested on NodeJS &lt; 16.3.0 and NPM &lt; 7.15.1

## NEW FEATURES

- e2e.browser.getProperty has been added to get a property (not the attribute) of an element
- Improve code documentation by replacing Yuidoc by JSDoc

## BUG FIXES

- Fix e2e tests methods using chechboxes which didn't work anymore since AngularJS no longer reflects boolean properties into attributes, it concerns e2e.asserts.TableAssert.checkLinesSelection, e2e.fields.CheckboxField.getValue, e2e.fields.CheckboxField.setValue, e2e.fields.CheckboxesField.getValue, e2e.pages.TablePage.isSelectedLine and e2e.pages.TablePage.deselectLine
- Fix e2e tests methods using "value" attribute which didn't work anymore since AngularJS no longer reflects "value" property into an attribute, it concerns e2e.fields.DateTimeField.getValue, e2e.fields.TextField.getValue and e2e.fields.TimeField.getValue
- Fix setValue of the fields based on a TextField which wasn't working in headless browser
- Fix e2e.pages.TablePage which could fail with the error "Cannot read property 'split' of null"

## DEPENDENCIES

- **chai** has been upgraded from 4.2.0 to **4.3.4**
- **eslint** has been upgraded from 22.0.0 to **23.0.0**
- **grunt-eslint** has been removed
- **grunt-gh-pages** has been replaced by @openveo/api ovDeployGithubPages script
- **htmlparser2** has been upgraded from 4.1.0 to **7.1.1**
- **yuidoc** has been replaced by **JSDoc**

# 8.0.0 / 2020-05-04

## BREAKING CHANGES

- Drop support for NodeJS &lt; 12.4.0 and NPM &lt; 6.9.0

## BUG FIXES

- Fix freeze when using e2e.pages.TablePage.openLine or e2e.pages.TablePage.selectFirstPageRange / e2e.pages.TablePage.selectLastPageRange with latest versions of Chromium / Google Chrome

## DEPENDENCIES

- **async** has been upgraded from 2.6.1 to **3.2.0**
- **htmlparser2** has been upgraded from 3.10.0 to **4.1.0**
- **grunt** has been upgraded from 1.0.3 to **1.1.0**
- **grunt-contrib-yuidoc** sub dependencies have been upgraded
- **grunt-eslint** has been upgraded from 21.0.0 to **22.0.0**
- **grunt-gh-pages** sub dependencies have been upgraded

# 7.1.0 / 2018-10-26

- e2e.fields.AutoCompleteField is now available to test ov-auto-complete directives

## DEPENDENCIES

- **chai** has been upgraded from 4.0.2 to **4.2.0**
- **htmlparser2** has been upgraded from 3.9.2 to **3.10.0**
- **async** has been upgraded from 2.1.4 to **2.6.1**
- **grunt** has been upgraded from 1.0.1 to **1.0.3**
- **grunt-gh-pages** has been upgraded from 2.0.0 to **3.1.0**
- **grunt-eslint** has been upgraded from 19.0.0 to **21.0.0**
- **@openveo/api** has been upgraded from 5.1.1 to **6.1.0*

# 7.0.0 / 2018-06-15

## BREAKING CHANGES

- Drop support for NodeJS &lt; 8.9.4 and NPM &lt; 5.6.0

## NEW FEATURES

- e2e.fields.DateTimeField is now available to test ov-date-time-picker directive
- e2e.fields.TextField has been improved to set the input value directly instead of adding characters one by one

## BUG FIXES

- Fix error handling when using e2e.pages.TablePage.getAllLineDetails, the error was catched silently and promise was never rejected
- Fix the *stale element reference* error which sometimes happened when closing the opened line using e2e.pages.TablePage.closeLine
- Fix e2e.pages.TablePage for tables containing &lt;table&gt; tags
- Fix hanging blank page appearing sometimes when using e2e.pages.BackEndPage.selectLanguage, e2e.pages.BackEndPage.load or e2e.pages.Page.load
- Fix unstable e2e.browser.click
- Fix e2e.pages.BackEndPage.logAs which could sometimes remains on the login page

# 6.0.0 / 2018-05-04

## BREAKING CHANGES

- @openveo/test now uses @openveo/api 5.\* which comes with important modifications. Models are no longer used and are replaced by providers with the following important consequences:
  - e2e.pages.TablePage now expects a Provider instead of a Model
  - e2e.helpers.Helper now expects a Provider instead of a Model

## NEW FEATURES

- Add NPM package-lock.json file

## BUG FIXES

- Fix helper addEntities method which wasn't returning collection in the expected order.

# 5.0.0 / 2017-10-19

## BREAKING CHANGES

- e2e.pages.BackEndPage now expects model "userLogin" instead of "userEmail" on login page. As it is possible to authenticate using either a surname, a nickname, an email and so on, login field model is now simply "userLogin"

## NEW FEATURES

- e2e.helpers.Helper.getEntities now accepts a filter parameter
- e2e.fields.TagsField has been improved to follow the new ov-tags directive features such as available options and auto completion
- e2e.fields.FakeField is now available to test a simple text associated to a label
- e2e.fields.MatchField is now available to test ov-match directives
- e2e.fields.BackEndPage is now capabable of logging against a CAS server or an LDAP server using logToCasAs and logToLdapAs. Not that logToCasAs implicates the use of cas-server-mock module to work

## BUG FIXES

- Fix e2e.asserts.TableAssert.checkLinesSelection which wasn't working if the associated helper didn't create entities with a "name" property. You can now specify the name of the property holding the name of your entity
- Fix e2e.pages.TablePage.removeLine. Sometimes the browser couldn't find the line to remove if already opened. It now closes the opened line first
- Set user property to null when logging out using e2e.pages.BackEndPage. User information was still available

# 4.1.0 / 2017-09-12

## NEW FEATURES

- require('@openveo/test').e2e.pages.BackEndPage.getLevel1MenuItems() is now capable of getting the total list of level 1 menu items, just don't specify the itemName parameter
- Add getLevel2MenuItems and isSubMenuOpened on require('@openveo/test').e2e.pages.BackEndPage to respectively be able to get level 2 menu items and test if a sub menu is opened
- Add require('@openveo/test').e2e.pages.TablePage.isSelectedLine() to test if a line is selected
- Add require('@openveo/test').e2e.pages.TablePage.deselectLine() to deselect a line
- Add require('@openveo/test').e2e.helpers.Helper.translate() to translate a dictionary key
- Add require('@openveo/test').e2e.fields.CheckboxesField.getOptions() to get the list of checkboxes labels
- require('@openveo/test').e2e.asserts.TableAssert.checkLinesSelection() is now more exhaustive
- Add require('@openveo/test').e2e.asserts.TableAssert.checkActions() to validates coherence between global actions and lines actions

## BUG FIXES

- Fix require('@openveo/test').e2e.pages.BackEndPage.clickMenu(). Promise could be rejected even if the element was found and clicked
- Fix require('@openveo/test').e2e.fields.TagsField.isOnError() and require('@openveo/test').e2e.fields.TextField.isOnError() which were always resolving to false
- Fix require('@openveo/test').e2e.fields.TablePage.selectLine(). When line was already selected the line was unselected
- Fix require('@openveo/test').e2e.fields.TablePage.selectAllLines(). When global checkbox was already checked it was unchecked
- Fix require('@openveo/test').e2e.fields.TablePage.getLineActions(). It wasn't closing the action dropdown
- Improve e2e functions stability by making sure they are treated just like other Protractor instructions

## DEPENDENCIES

- **chai** has been upgraded from 3.5.0 to **4.0.2**
- **chai-as-promised** has been upgraded from 6.0.0 to **7.1.1**

# 4.0.2 / 2017-05-04

## BUG FIXES

- Authorize future minor versions of @openveo/api

# 4.0.1 / 2017-05-04

## BUG FIXES

- Fix documentation link

# 4.0.0 / 2017-05-04

## BREAKING CHANGES

- require('@openveo/test').e2e classes' properties are now unalterable
- Remove require('@openveo/test').ut.generator
- End to end tests API now uses "query" instead of "name" as the search engine field in TableAssert
- Drop support for Node.js &lt;7.4.0
- Drop support for NPM &lt;4.0.5

## NEW FEATURES

- Add TinyMCEField field type to require('@openveo/test').e2e.fields

## BUG FIXES

- End to end tests using e2e.TableAssert were failing if chai or chai-as-promised module was missing
- Unit tests using ut.inlineTemplatesPreprocessor were throwing an error due to missing htmlparser2 module
- Fix end to end API "BackEndPage.openSubMenu" and "BackEndPage.closeSubMenu" which failed if one of the first level menu items didn't have a sub menu

## DEPENDENCIES

- **grunt-eslint** has been updated from 18.1.0 to **19.0.0**
- **pre-commit** has been updated from 1.1.2 to **1.2.2**
- **grunt-gh-pages** has been updated from 1.1.0 to **2.0.0**

# 3.0.0 / 2016-05-30

- Update e2e tools to introduce helpers and models (Entity and ContentEntity)
- Update package dependencies
- Update translations due to openveo-api new interface
- Add e2e test for form fields (tags, checkbox...)

# 2.0.0 / 2016-02-19

- Add e2e tools to help write automated end to end tests using protractor. Consequently openveo-test is now split in 2 : the unit tests library and the end to end tests library. Unit test generator, which used to be accessible through require('@openveo/test').generator, is now accessible through require('@openveo/test').unit.generator
- Update server unit tests to fit new Database interface comming with [OpenVeo API](https://github.com/veo-labs/openveo-api) 2.0.0

# 1.0.2 / 2015-11-26

Remove peer dependencies on @openveo/core and @openveo/publish projects

# 1.0.1 / 2015-11-02

- Correct peer dependencies versions on projects [OpenVeo Core](https://github.com/veo-labs/openveo-core) and [OpenVeo Publish](https://github.com/veo-labs/openveo-publish). Versions were relying on unknown versions blocking installation of projects in development mode.

# 1.0.0 / 2015-10-26

First stable version of OpenVeo test providing mocks for Database, Web Service scopes and permissions.
