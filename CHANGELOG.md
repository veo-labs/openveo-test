# 7.0.0 / YYYY-MM-DD

## BREAKING CHANGES

- Drop support for NodeJS &lt; 8.9.4 and NPM &lt; 5.6.0

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
