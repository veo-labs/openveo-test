'use strict';

/**
 * @module e2e
 */

var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');

// Load assertion library
var assert = chai.assert;
chai.use(chaiAsPromised);

/**
 * Creates a table assertion helper to help writing assertions for table pages.
 *
 * @example
 *
 *     var TableAssert = require('@openveo/test').e2e.asserts.TableAssert;
 *
 *     // With MyTablePage extending TablePage
 *     var page = new MyTablePage();
 *     var helper = new MyHelper(new MyModel());
 *     var tableAssert = new TableAssert(page, helper);
 *
 * @class TableAssert
 * @constructor
 * @param {TablePage} page The table page to test
 * @param {Helper} helper The helper to manipulate entities without interacting with the web browser
 */
function TableAssert(page, helper) {

  /**
   * The page containing the table to test.
   *
   * @property page
   * @type TablePage
   */
  this.page = page;

  /**
   * The helper to manipulate entities.
   *
   * @property helper
   * @type Helper
   */
  this.helper = helper;

}

module.exports = TableAssert;

/**
 * Checks that table navigation is working.
 *
 * Use table navigation links to navigate on pages and verify, on each page, the current page, total pages,
 * total lines and the number of lines in the page.
 *
 * @example
 *
 *     // With MyTablePage extending TablePage
 *     var page = new MyTablePage();
 *     var helper = new MyHelper(new MyModel());
 *     var tableAssert = new TableAssert(page, helper);
 *     tableAssert.checkPagination(50, 10);
 *
 * @method private
 * @method checkNavigation
 * @param {Number} totalElements The total number of elements
 * @param {Number} numberPerPage The number of elements displayed per page
 * @param {Number} [index] The page index
 * @return {Promise} Promise resolving when navigation has been checked
 */
function checkNavigation(totalElements, numberPerPage, index) {
  index = index || 1;
  var self = this;
  var totalPages = Math.ceil(totalElements / numberPerPage);

  if (index <= totalPages) {

    // Select page
    return this.page.selectPage(index).then(function() {

      // Calculate the theorical total number of elements in this page
      var linesNumber = numberPerPage;

      // Last page
      if (index === totalPages)
        linesNumber = numberPerPage - ((numberPerPage * index) - totalElements);

      // Check navigation
      assert.eventually.equal(self.page.getCurrentPage(), index, 'Current page incorrect');
      assert.eventually.equal(self.page.getTotalPages(), totalPages, 'Total pages incorrect');
      assert.eventually.equal(self.page.getTotalLines(), totalElements, 'Total lines incorrect');
      assert.eventually.equal(self.page.getLinesInPageNumber(), linesNumber, 'Number of lines in page incorrect');

      return browser.waitForAngular();
    }).then(function() {
      return checkNavigation.call(self, totalElements, numberPerPage, ++index);
    });
  } else {
    return protractor.promise.fulfilled();
  }
}

/**
 * Checks if lines are correctly sorted for both ascending and descending order.
 *
 * You don't need to add lines to the table before calling this method. Necessary lines are automatically added
 * and then removed using helper addEntitiesAuto / removeEntities methods.
 *
 * @example
 *
 *     // With MyTablePage extending TablePage
 *     var page = new MyTablePage();
 *     var helper = new MyHelper(new MyModel());
 *     var tableAssert = new TableAssert(page, helper);
 *     tableAssert.checkSort('My column');
 *
 * @method checkSort
 * @param {String} property The name of the column to sort on
 * @return {Promise} Promise resolving when sort has been checked
 */
TableAssert.prototype.checkSort = function(property) {
  var self = this;
  var totalLinesInPage;
  var totalLinesToAdd = 2;
  var name = 'test sort';
  var lines;

  return browser.waitForAngular().then(function() {

    // Add lines
    self.helper.addEntitiesAuto(name, totalLinesToAdd).then(function(addedLines) {
      lines = addedLines;
      return self.page.refresh();
    });

    // Select first page
    self.page.selectPage(1);

    // Get the number of lines in the page
    self.page.getLinesInPageNumber().then(function(total) {
      totalLinesInPage = total;
    });

    // Sort by property asc and verify that values are correctly sorted
    self.page.sortBy(property, true);
    self.page.getLineValues(property).then(function(values) {
      var sortedValues = values.slice().sort();

      for (var i = 0; i < totalLinesInPage.length; i++)
        assert.equal(values[i], sortedValues[i]);
    });

    // Sort by property desc and verify that values are correctly sorted
    self.page.sortBy(property, false);
    self.page.getLineValues(property).then(function(values) {
      var sortedValues = values.slice().sort().reverse();

      for (var i = 0; i < totalLinesInPage.length; i++)
        assert.equal(values[i], sortedValues[i]);
    });

    return browser.waitForAngular().then(function() {

      // Removes lines
      self.helper.removeEntities(lines);
      return self.page.refresh();

    });

  });
};

/**
 * Checks if buttons to change the number of displayed items per page are displayed correctly depending on the
 * actual number of lines in the table.
 *
 * @example
 *
 *     // With MyTablePage extending TablePage
 *     var page = new MyTablePage();
 *     var helper = new MyHelper(new MyModel());
 *     var tableAssert = new TableAssert(page, helper);
 *     tableAssert.checkItemsPerPageButtons();
 *
 * @private
 * @method checkItemsPerPageButtons
 * @return {Promise} Promise resolving when buttons have been checked
 */
function checkItemsPerPageButtons() {
  var self = this;

  // Get the total number of lines (all pages combined)
  return this.page.getTotalLines().then(function(totalLines) {
    if (totalLines < 6) {

      // Only one page

      assert.eventually.equal(self.page.itemsPerPageLinkElements.count(), 0);
    } else {

      // Several pages

      var expectedNumberOfButtons = Math.min(Math.ceil(totalLines / 10) + 1, 4);
      assert.eventually.equal(self.page.itemsPerPageLinkElements.count(), expectedNumberOfButtons);
    }
  });
}

/**
 * Checks if buttons to change the number of displayed items per page are correctly displayed regarding the
 * total number of lines.
 *
 * You don't need to add lines to the table before calling this method. Necessary lines are automatically added
 * and then removed using page addEntitiesAuto / removeEntities methods.
 *
 * @example
 *
 *     // With MyTablePage extending TablePage
 *     var page = new MyTablePage();
 *     var helper = new MyHelper(new MyModel());
 *     var tableAssert = new TableAssert(page, helper);
 *     tableAssert.checkItemsPerPage();
 *
 * @method checkItemsPerPage
 * @return {Promise} Promise resolving when buttons per page have been checked
 */
TableAssert.prototype.checkItemsPerPage = function() {
  var self = this;
  var totalLinesToAdd = 31;
  var i = 0;
  var name = 'test items per page buttons';
  var lines = [];
  var search = {name: name};

  // Verify buttons to change the number of displayed items
  return this.page.search(search).then(function() {
    checkItemsPerPageButtons.call(self);

    // Add lines 6 lines
    self.helper.addEntitiesAuto(name, i + 6).then(function(addedLines) {
      self.page.refresh();
      self.page.search(search);
      lines = lines.concat(addedLines);
    });
    i += 6;

    // Verify buttons to change the number of displayed items
    checkItemsPerPageButtons.call(self);

    // Add lines to have 11 lines
    self.helper.addEntitiesAuto(name, 5, i + 1).then(function(addedLines) {
      self.page.refresh();
      self.page.search(search);
      lines = lines.concat(addedLines);
    });
    i += 5;

    // Verify buttons to change the number of displayed items
    checkItemsPerPageButtons.call(self);

    // Add 10 lines by 10 lines and verify, each time, that a new button to change the number of displayed items per
    // page is added
    while (i < totalLinesToAdd) {

      self.helper.addEntitiesAuto(name, Math.min(i + 10, totalLinesToAdd), i).then(function(addedLines) {
        self.page.refresh();
        self.page.search(search);
        lines = lines.concat(addedLines);
      });

      i = Math.min(i + 10, totalLinesToAdd);

      // Verify buttons to change the number of displayed items
      checkItemsPerPageButtons.call(self);
    }

    // Clear search engine
    self.page.clearSearch();

    return browser.waitForAngular().then(function() {

      // Removes lines
      self.helper.removeEntities(lines);
      return self.page.refresh();

    });
  });
};

/**
 * Checks if removing several lines at the same time works correctly.
 *
 * You don't need to add lines to the table before calling this method. Necessary lines are automatically added
 * and then removed using page addEntitiesAuto / removeEntities methods.
 *
 * @example
 *
 *     // With MyTablePage extending TablePage
 *     var page = new MyTablePage();
 *     var helper = new MyHelper(new MyModel());
 *     var tableAssert = new TableAssert(page, helper);
 *     tableAssert.checkMassiveRemove();
 *
 * @method checkMassiveRemove
 * @return {Promise} Promise resolving when massive remove has been checked
 */
TableAssert.prototype.checkMassiveRemove = function() {
  var self = this;
  var totalLinesToAdd = 4;
  var name = 'test massive remove';
  var search = {name: name};

  return browser.waitForAngular().then(function() {

    // Add lines
    self.helper.addEntitiesAuto(name, totalLinesToAdd).then(function() {
      self.page.refresh();

      // Search for those lines
      self.page.search(search);

    });

    // Select the first half of lines
    for (var i = 0; i < (totalLinesToAdd / 2); i++)
      self.page.selectLine(name + ' ' + i);

    // Remove first half
    self.page.removeAllSelectedLinesInPage();

    // Remove last half of applications
    self.page.removeAllLinesInPage();

    // Clear search fields
    return self.page.clearSearch();

  });
};

/**
 * Checks if pagination works correctly.
 *
 * You don't need to add lines to the table before calling this method. Necessary lines are automatically added
 * and then removed using page addEntitiesAuto / removeEntities methods.
 *
 * @example
 *
 *     // With MyTablePage extending TablePage
 *     var page = new MyTablePage();
 *     var helper = new MyHelper(new MyModel());
 *     var tableAssert = new TableAssert(page, helper);
 *     tableAssert.checkPagination();
 *
 * @method checkPagination
 * @return {Promise} Promise resolving when pagination has been checked
 */
TableAssert.prototype.checkPagination = function() {
  var self = this;
  var lines;
  var totalLinesToAdd = 31;
  var name = 'test pagination';
  var search = {name: name};

  return browser.waitForAngular().then(function() {

    // Add lines
    self.helper.addEntitiesAuto(name, totalLinesToAdd).then(function(addedLines) {
      self.page.refresh();
      self.page.search(search);
      lines = addedLines;
    });

    // Test pagination
    self.page.getTotalLines().then(function(totalLines) {
      var itemsPerPage = [5, 10, 20, 30];

      for (var i = 0; i < itemsPerPage.length; i++) {
        var lastIndex = (i - 1) || 0;
        var itemPerPage = itemsPerPage[i];
        if (totalLines > itemsPerPage[lastIndex]) {
          self.page.setLinesNumber(itemPerPage);
          checkNavigation.call(self, totalLines, itemPerPage);
        }
      }
    });

    // Clear search engine
    self.page.clearSearch();

    return browser.waitForAngular().then(function() {

      // Removes lines
      self.helper.removeEntities(lines);
      return self.page.refresh();

    });

  });

};

/**
 * Checks if search engine works correctly.
 *
 * @example
 *
 *     // With MyTablePage extending TablePage
 *     var page = new MyTablePage();
 *     var helper = new MyHelper(new MyModel());
 *     var tableAssert = new TableAssert(page, helper);
 *
 *     var expectedValues = ['Test 1', 'Test 2'];
 *     var search = { name: 'Name' };
 *
 *     // Execute search and get all values of column 'Name' then compare this values to the expected values
 *     tableAssert.checkSearch(search, expectedValues, 'Name');
 *
 * @method checkSearch
 * @param {Object} search A search description object
 * @param {Array} expectedValues The expected list of line values corresponding to the research
 * @param {String} columnName The name of the column to extract value from and compare to expectedValues
 * @return {Promise} Promise resolving when search has been checked
 */
TableAssert.prototype.checkSearch = function(search, expectedValues, columnName) {
  var self = this;

  // Execute search
  return this.page.search(search).then(function() {

    // Get all line values after search
    self.page.getLineValues(columnName).then(function(values) {
      for (var i = 0; i < expectedValues.length; i++)
        assert.ok(values.indexOf(expectedValues[i]) >= 0);

      // Check if values correspond to expected ones
      assert.equal(values.length, expectedValues.length, expectedValues.length + ' line(s) must correspond to ' +
                   'the search');

    });

    return self.page.clearSearch();

  });
};

/**
 * Checks if canceling a remove action is working correctly.
 *
 * You don't need to add lines to the table before calling this method. Necessary lines are automatically added
 * and then removed using page addEntitiesAuto / removeEntities methods.
 *
 * @example
 *
 *     // With MyTablePage extending TablePage
 *     var page = new MyTablePage();
 *     var helper = new MyHelper(new MyModel());
 *     var tableAssert = new TableAssert(page, helper);
 *     tableAssert.checkCancelRemove();
 *
 * @method checkCancelRemove
 * @return {Promise} Promise resolving when cancel is checked
 */
TableAssert.prototype.checkCancelRemove = function() {
  var self = this;
  var name = 'test cancel';
  var lines;

  return browser.waitForAngular().then(function() {

    // Create line
    self.helper.addEntitiesAuto(name, 1).then(function(addedLines) {
      lines = addedLines;
      self.page.refresh();
    });

    // Perform remove action and cancel it
    self.page.performAction(name + ' 0', self.page.translations.CORE.UI.REMOVE);
    browser.wait(self.page.EC.visibilityOf(self.page.dialogElement), 1000, 'Missing confirmation dialog');
    self.page.cancelAction();

    return browser.waitForAngular().then(function() {

      // Removes lines
      self.helper.removeEntities(lines);
      return self.page.refresh();

    });

  });

};

/**
 * Checks if selecting lines works.
 *
 * You don't need to add lines to the table before calling this method. Necessary lines are automatically added
 * and then removed using page addEntitiesAuto / removeEntities methods.
 *
 * @example
 *
 *     // With MyTablePage extending TablePage
 *     var page = new MyTablePage();
 *     var helper = new MyHelper(new MyModel());
 *     var tableAssert = new TableAssert(page, helper);
 *     tableAssert.checkLinesSelection('My column');
 *
 * @method checkLinesSelection
 * @param {String} columnTitle The name of the column to get lines
 * @return {Promise} Promise resolving when selection is checked
 */
TableAssert.prototype.checkLinesSelection = function(columnTitle) {
  var self = this;
  var name = 'test lines selection';
  var lines;

  return browser.waitForAngular().then(function() {
    var pageLinesNames;

    // Create lines
    self.helper.addEntitiesAuto(name, 2).then(function(addedLines) {
      self.page.refresh();
      lines = addedLines;
    }).then(function() {

      // Get lines names
      return self.page.getLineInPageValues(columnTitle);

    }).then(function(linesNames) {
      var promises = [];
      pageLinesNames = linesNames;

      // Select lines one by one
      for (var i = 0; i < pageLinesNames.length; i++)
        promises.push(self.page.selectLine(linesNames[i]));

      return protractor.promise.all(promises);
    }).then(function() {

      // Check if all actions checkbox is selected
      assert.eventually.ok(self.page.selectAllElement.isSelected());

      // Unselect a line
      self.page.selectLine(pageLinesNames[0]);

      // Check if all actions checkbox is not selected
      assert.eventually.notOk(self.page.selectAllElement.isSelected());

    });

    return browser.waitForAngular().then(function() {

      // Removes lines
      self.helper.removeEntities(lines);
      return self.page.refresh();

    });
  });

};
