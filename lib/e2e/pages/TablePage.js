'use strict';

/**
 * @module e2e
 */

var util = require('util');
var async = require('async');
var browserExt = process.requireTest('lib/e2e/browser.js');
var BackEndPage = process.requireTest('lib/e2e/pages/BackEndPage.js');

/**
 * Creates a new TablePage representing a back end page with a table and form to add an entity.
 *
 * Do not use this directly but extend it.
 *
 * @example
 *
 *     var TablePage = require('@openveo/test').e2e.TablePage;
 *
 *     function MyTablePage() {
 *       MyTablePage.super_.call(this);
 *       this.path = 'be/myTablePage';
 *     }
 *
 *     module.exports = MyTablePage;
 *     util.inherits(MyTablePage, TablePage);
 *
 *     var page = new MyTablePage();
 *     page.logAsAdmin();
 *     page.load().then(function() {
 *       console.log('Page fully loaded in the first language');
 *     });
 *
 * @class TablePage
 * @extends BackEndPage
 * @constructor
 * @param {EntityModel} model Model to interact directly with the database
 */
function TablePage(model) {
  TablePage.super_.call(this);
  this.model = model;

  /**
   * Form element to add a new entity.
   *
   * @property addFormElement
   * @type ElementFinder
   */
  this.addFormElement = element(by.css('.add-form'));

  /**
   * Link to open / close form element to add a new entity.
   *
   * @property addLinkElement
   * @type ElementFinder
   */
  this.addLinkElement = element(by.css('.add-element'));

  /**
   * Wrapper of the add form element.
   *
   * This element will be displayed when add form is displayed and hidden when add form is closed.
   *
   * @property addFormWrapperElement
   * @type ElementFinder
   */
  this.addFormWrapperElement = this.addLinkElement.element(by.xpath('..'))
    .all(by.css('div[uib-collapse="isCollapsed"]')).first();

  /**
   * Submit button of the form to add a new entity.
   *
   * @property addButtonElement
   * @type ElementFinder
   */
  this.addButtonElement = this.addFormElement.element(by.css('button'));

  /**
   * Table element.
   *
   * @property tableElement
   * @type ElementFinder
   */
  this.tableElement = element(by.css('.datatable table'));

  /**
   * Table row elements.
   *
   * @property rowElements
   * @type ElementArrayFinder
   */
  this.rowElements = this.tableElement.all(by.css('tbody > tr'));

  /**
   * Table header elements.
   *
   * @property headerElements
   * @type ElementArrayFinder
   */
  this.headerElements = this.tableElement.all(by.css('thead th'));

  /**
   * Opened line detail containing information about the opened line.
   *
   * @property lineDetailElement
   * @type ElementFinder
   */
  this.lineDetailElement = element(by.css('.datatable tr.detail'));

  /**
   * Checkbox to select all line.
   *
   * @property selectAllElement
   * @type ElementFinder
   */
  this.selectAllElement = element(by.css('.allactions input[type="checkbox"]'));

  /**
   * Main action button element to perform actions on all selected lines.
   *
   * @property actionsButtonElement
   * @type ElementFinder
   */
  this.actionsButtonElement = element(by.css('.allactions button'));

  /**
   * Element holding the list of actions under main action button.
   *
   * @property actionsElement
   * @type ElementFinder
   */
  this.actionsElement = element(by.css('.allactions ul'));

  /**
   * Dialog box.
   *
   * @property dialogElement
   * @type ElementFinder
   */
  this.dialogElement = element(by.css('.modal-dialog'));

  /**
   * Dialog box confirmation button.
   *
   * @property dialogConfirmActionButtonElement
   * @type ElementFinder
   */
  this.dialogConfirmActionButtonElement = this.dialogElement.element(by.css('.btn-primary'));

  /**
   * Dialog box cancel button.
   *
   * @property dialogCancelActionButtonElement
   * @type ElementFinder
   */
  this.dialogCancelActionButtonElement = this.dialogElement.element(by.css('.btn-warning'));

  /**
   * Search engine form to filter lines in the table.
   *
   * @property searchFormElement
   * @type ElementFinder
   */
  this.searchFormElement = element(by.css('.search-fields'));

  /**
   * Link to open / close search engine.
   *
   * @property searchLinkElement
   * @type ElementFinder
   */
  this.searchLinkElement = element(by.css('.search-title'));

  /**
   * Element holding the current table page (pagination).
   *
   * @property currentPageElement
   * @type ElementFinder
   */
  this.currentPageElement = element(by.exactBinding('pagination.page'));

  /**
   * Element holding the total number of table pages (pagination).
   *
   * @property totalPagesElement
   * @type ElementFinder
   */
  this.totalPagesElement = element(by.exactBinding('pagination.pages'));

  /**
   * Element holding the total number of lines in all table pages (pagination).
   *
   * @property totalLinesElement
   * @type ElementFinder
   */
  this.totalLinesElement = element(by.exactBinding('pagination.size'));

  /**
   * Pagination links wrapper.
   *
   * @property paginationElement
   * @type ElementFinder
   */
  this.paginationElement = element(by.css('.pagination'));

  /**
   * List of pagination links, including the previous and next range buttons.
   *
   * @property paginationLinkElements
   * @type ElementArrayFinder
   */
  this.paginationLinkElements = this.paginationElement.all(by.css('li'));

  /**
   * List of pagination links, excluding the previous and next range buttons.
   *
   * @property paginationPageLinkElements
   * @type ElementArrayFinder
   */
  this.paginationPageLinkElements = this.paginationElement.all(by.repeater('numPage in rangePage')).all(by.css('a'));

  /**
   * Pagination previous range link.
   *
   * @property paginationPreviousRangeElement
   * @type ElementFinder
   */
  this.paginationPreviousRangeElement = this.paginationLinkElements.first();

  /**
   * Pagination next range link.
   *
   * @property paginationNextRangeElement
   * @type ElementFinder
   */
  this.paginationNextRangeElement = this.paginationLinkElements.last();

  /**
   * List of per page links to select the number of elements to display per table page.
   *
   * @property itemsPerPageLinkElements
   * @type ElementArrayFinder
   */
  this.itemsPerPageLinkElements = element.all(by.repeater('count in listItemsPerPageShow'));
}

module.exports = TablePage;
util.inherits(TablePage, BackEndPage);

/**
 * Finds a line.
 *
 * Iterate through the given list of lines to look for the expected line.
 *
 * @private
 * @method getLineByIndex
 * @param {Array} trElements The list of line elements
 * @param {String} name The name of the line to look for
 * @param {Number} [index] The index in trElements to start from
 * @return {Promise} Promise resolving with the tr element, td element and index
 */
function getLineByIndex(trElements, name, index) {
  index = index || 0;
  var deferred = protractor.promise.defer();
  var self = this;

  if (index < trElements.length && trElements.length) {
    var trElement = trElements[index];

    // Look at all td elements in the tr element to find the desired one
    trElement.all(by.css('td')).filter(function(tdElement, index) {
      return tdElement.getText().then(function(text) {
        return text === name;
      });
    }).then(function(tdElements) {
      if (tdElements.length) {

        // Line found
        deferred.fulfill({
          trElement: trElement,
          tdElement: tdElements[0],
          index: index
        });

      } else {

        // Line not found

        // Try next line
        getLineByIndex.call(self, trElements, name, ++index).then(function(elements) {
          deferred.fulfill(elements);
        }, function(error) {
          deferred.reject(error);
        });
      }
    });
  }
  else
    deferred.reject(new Error('No lines corresponding to ' + name));

  return deferred.promise;
}

/**
 * Finds a line by page.
 *
 * Iterate through all lines of all pages to look for the expected line.
 * It starts at current page.
 *
 * @private
 * @method getLineByPage
 * @param {String} name The name of the line to look for
 * @param {Number} totalPages The total number of pages
 * @return {Promise} Promise resolving with the searched line
 */
function getLineByPage(name, totalPages) {
  var self = this;
  var deferred = protractor.promise.defer();

  this.getLineInPage(name).then(function(line) {

    // Line find in current page
    deferred.fulfill(line);

  }, function(error) {

    // Line not found in current page

    self.getCurrentPage().then(function(currentPage) {
      if ((currentPage + 1) <= totalPages) {

        // Got more pages

        // Select next page
        return self.selectPage(currentPage + 1).then(function() {

          // Get line in page
          return getLineByPage.call(self, name, totalPages);

        });

      } else {

        // No more page, line has not been found
        return protractor.promise.rejected(new Error('No lines corresponding to ' + name));

      }
    }).then(function(line) {
      deferred.fulfill(line);
    }, function(error) {
      deferred.reject(error);
    });

  });

  return deferred.promise;
}

/**
 * Selects a page.
 *
 * Look for page link in pagination links, if page link is not in the pagination actual range, it will search for
 * the page link in the other pagination ranges.
 *
 * @private
 * @method selectPageByRange
 * @param {String} page The page to select (starting at 1 instead of 0)
 * @return {Promise} Promise resolving when the page is selected
 */
function selectPageByRange(page) {
  var self = this;
  var deferred = protractor.promise.defer();

  // Filter the list of pagination links to get the link corresponding to the page
  this.paginationPageLinkElements.filter(function(element, index) {
    return element.all(by.css('span')).first().getText().then(function(text) {
      return text.replace(/ ?\(current\)/, '') == page;
    });
  }).then(function(links) {
    if (links.length) {

      // Page link found

      // Click on it
      browserExt.click(links[0]).then(function() {
        deferred.fulfill();
      });

    } else {

      // Page link not found
      self.isNextRangeLinkEnabled().then(function(isEnabled) {
        if (isEnabled) {

          // There is a next range

          // Select next range
          self.selectNextPageRange();

          // Try to find the page in the next range
          return selectPageByRange.call(self, page);

        } else {

          // Already in last range
          // Page link not found
          return protractor.promise.rejected(new Error('No page ' + page + ' found'));

        }

      }).then(function() {
        deferred.fulfill();
      }, function(error) {
        deferred.reject(error);
      });
    }
  });

  return deferred.promise;
}

/**
 * Gets the index of a table column in the list of columns.
 *
 * @private
 * @method getHeaderIndex
 * @param {String} name The value of the header to look for
 * @return {Promise} Promise resolving with the index of the column
 */
function getHeaderIndex(name) {
  var deferred = protractor.promise.defer();
  var headerIndex = -1;

  this.headerElements.each(function(thElement, index) {
    thElement.getText().then(function(text) {
      if (text === name)
        headerIndex = index;
    });
  }).then(function() {
    if (headerIndex >= 0)
      deferred.fulfill(headerIndex);
    else
      deferred.reject(new Error('Table header "' + name + '" not found'));
  });

  return deferred.promise;
}

/**
 * Gets line column values in a page.
 *
 * @private
 * @method getLineValuesByIndex
 * @param {Array} lines The lines in the page
 * @param {Number} headerIndex The index of the column to read
 * @param {Number} [index=0] Current line index being inspected
 * @return {Promise} Promise resolving with lines values
 */
function getLineValuesByIndex(lines, headerIndex, index) {
  index = index || 0;
  var self = this;
  var deferred = protractor.promise.defer();
  var values = [];
  var line = lines[index];

  line.all(by.css('td')).get(headerIndex + 1).getText().then(function(text) {
    values.push(text);

    if ((index + 1) < lines.length) {
      return getLineValuesByIndex.call(self, lines, headerIndex, ++index);
    } else {
      deferred.fulfill(values);
      return protractor.promise.rejected(new Error('No more lines'));
    }

  }).then(function(newValues) {
    values = values.concat(newValues);
    deferred.fulfill(values);
  }).then(null, function(error) {

    // Nothing to do, promise is rejected but it's not an error

  });

  return deferred.promise;
}

/**
 * Gets line column values in all pages.
 *
 * @private
 * @method getLineValuesByPage
 * @param {Number} headerIndex The index of the column to read
 * @param {Number} totalPages The total number of pages
 * @return {Promise} Promise resolving with cell values
 */
function getLineValuesByPage(headerIndex, totalPages) {
  var self = this;
  var values = [];
  var deferred = protractor.promise.defer();

  this.getLinesInPage().then(function(lines) {
    if (lines.length) {

      // Found lines in the page

      return getLineValuesByIndex(lines, headerIndex);
    } else {

      // No lines in the page

      return deferred.reject(new Error('No lines'));
    }
  }).then(function(lineValuesInPage) {

    // Got line values in the page

    values = values.concat(lineValuesInPage);
    return self.getCurrentPage();
  }).then(function(currentPage) {
    if ((currentPage + 1) <= totalPages) {

      // Got more pages

      // Select next page
      return self.selectPage(currentPage + 1);

    } else {

      // No more pages

      deferred.fulfill(values);
      return protractor.promise.rejected(new Error('No more pages'));
    }
  }).then(function() {

    // Next page selected

    // Get all values in the page
    return getLineValuesByPage.call(self, headerIndex, totalPages);
  }).then(function(lineValuesInPage) {
    values = values.concat(lineValuesInPage);
    deferred.fulfill(values);
  }).then(null, function(error) {

    // Nothing to do, promise is rejected but it's not an error

  });

  return deferred.promise;
}

/**
 * Gets all lines in the table (tr elements) except the opened one.
 *
 * @example
 *
 *     // With MyTablePage extending TablePage
 *     var page = new MyTablePage();
 *     page.logAsAdmin();
 *     page.load();
 *     page.getLinesInPage().then(function(lines) {
 *       console.log(lines);
 *     });
 *
 * @method getLinesInPage
 * @return {Promise} Promise resolving with the list of lines elements in the page
 */
TablePage.prototype.getLinesInPage = function() {
  var deferred = protractor.promise.defer();

  this.rowElements.filter(function(rowElement, index) {
    return rowElement.getAttribute('class').then(function(classes) {
      classes = classes.split(' ');
      return classes.indexOf('detail') < 0;
    });
  }).then(function(items) {
    deferred.fulfill(items);
  }, function(error) {
    deferred.reject(error);
  });

  return deferred.promise;
};

/**
 * Gets a line in the page.
 *
 * @example
 *
 *     // With MyTablePage extending TablePage
 *     var page = new MyTablePage();
 *     page.logAsAdmin();
 *     page.load();
 *     page.getLineInPage('My line').then(function(line) {
 *
 *       // Line element
 *       console.log(line.trElement);
 *
 *       // Cell element containing the searched name
 *       console.log(line.tdElement);
 *
 *       // Index of the line in its page
 *       console.log(line.index);
 *
 *     });
 *
 * @method getLineInPage
 * @param {String} name The name of the line to find, each column of the line will be compared to this value
 * @return {Promise} Promise resolving with the line
 */
TablePage.prototype.getLineInPage = function(name) {
  var self = this;

  // Get all lines except opened ones
  return this.getLinesInPage().then(function(lines) {

    // Got all lines except opened lines
    return getLineByIndex.call(self, lines, name);

  });
};

/**
 * Gets the number of lines in the page.
 *
 * @example
 *
 *     // With MyTablePage extending TablePage
 *     var page = new MyTablePage();
 *     page.logAsAdmin();
 *     page.load();
 *     page.getLinesInPageNumber().then(function(linesNumber) {
 *       console.log('This page contains ' + linesNumber + ' lines');
 *     });
 *
 * @method getLinesInPageNumber
 * @return {Promise} Promise resolving with the number of lines in the page
 */
TablePage.prototype.getLinesInPageNumber = function() {
  return this.getLinesInPage().then(function(lines) {
    return protractor.promise.fulfilled(lines.length);
  });
};

/**
 * Opens add form.
 *
 * @example
 *
 *     // With MyTablePage extending TablePage
 *     var page = new MyTablePage();
 *     page.logAsAdmin();
 *     page.load();
 *     page.openAddForm().then(function() {
 *       console.log('Add form opened');
 *     });
 *
 * @method openAddForm
 * @return {Promise} Promise resolving when add form is opened
 */
TablePage.prototype.openAddForm = function() {
  var self = this;

  return this.addFormWrapperElement.isDisplayed().then(function(isDisplayed) {
    if (!isDisplayed) {

      // Open add form
      browserExt.click(self.addLinkElement);

      return browser.wait(self.EC.visibilityOf(self.addFormWrapperElement), 1000, 'Missing add form');
    } else {

      // Add form is already displayed
      return protractor.promise.fulfilled();

    }
  }).then(function() {
    return protractor.promise.fulfilled();
  });
};

/**
 * Closes formular to add an item.
 *
 * @example
 *
 *     // With MyTablePage extending TablePage
 *     var page = new MyTablePage();
 *     page.logAsAdmin();
 *     page.load();
 *     page.openAddForm();
 *     page.closeAddForm().then(function() {
 *       console.log('Add form closed');
 *     });
 *
 * @method closeAddForm
 * @return {Promise} Promise resolving when add form is closed
 */
TablePage.prototype.closeAddForm = function() {
  var self = this;

  return this.addFormWrapperElement.isDisplayed().then(function(isDisplayed) {
    if (isDisplayed) {

      // Close add form
      browserExt.click(self.addLinkElement);

      // Wait for the menu to be invisible
      return browser.wait(self.EC.invisibilityOf(self.addFormWrapperElement), 1000, 'Add form still visible');
    } else {

      // Add form is already closed
      return protractor.promise.fulfilled();

    }
  }).then(function() {
    return protractor.promise.fulfilled();
  });
};

/**
 * Submit formular to add an item.
 *
 * @example
 *
 *     // With MyTablePage extending TablePage
 *     var page = new MyTablePage();
 *     page.logAsAdmin();
 *     page.load();
 *     page.submitAddForm().then(function() {
 *       console.log('Add form submitted');
 *     });
 *
 * @method submitAddForm
 * @return {Promise} Promise resolving when add form submit button has been clicked
 */
TablePage.prototype.submitAddForm = function() {
  return browserExt.click(this.addButtonElement);
};

/**
 * Gets a line.
 *
 * Looks for a line in all pages.
 *
 * @example
 *
 *     // With MyTablePage extending TablePage
 *     var page = new MyTablePage();
 *     page.logAsAdmin();
 *     page.load();
 *     page.getLine('My line').then(function(line) {
 *
 *       // Line element
 *       console.log(line.trElement);
 *
 *       // Cell element containing the searched name
 *       console.log(line.tdElement);
 *
 *       // Index of the line in its page
 *       console.log(line.index);
 *
 *     });
 *
 * @method getLine
 * @param {String} name The name of the line to retrieve, each column of the line will be compared to this value
 * @return {Promise} Promise resolving with the line
 */
TablePage.prototype.getLine = function(name) {
  var self = this;
  var promises = [this.getCurrentPage(), this.getTotalPages()];

  return protractor.promise.all(promises).then(function(values) {
    var currentPage = values[0];
    var totalPages = values[1];

    if (totalPages) {

      if (currentPage != 1)
        self.selectPage(1);

      return getLineByPage.call(self, name, totalPages);

    } else {
      return protractor.promise.rejected(new Error('No lines'));
    }

  });
};

/**
 * Gets cell values of all lines in all pages.
 *
 * @example
 *
 *     // With MyTablePage extending TablePage
 *     var page = new MyTablePage();
 *     page.logAsAdmin();
 *     page.load();
 *     page.getLineValues('Name').then(function(values) {
 *      console.log(values);
 *     });
 *
 * @method getLineValues
 * @param {String} headerTitle Title of the column to extract values from
 * @return {Promise} Promise resolving with the list of values
 */
TablePage.prototype.getLineValues = function(headerTitle) {
  var self = this;
  var promises = [this.getCurrentPage(), this.getTotalPages()];
  var currentPage;
  var totalPages;

  return protractor.promise.all(promises).then(function(values) {
    currentPage = values[0];
    totalPages = values[1];

    if (totalPages) {
      if (currentPage != 1)
        self.selectPage(1);

      return getHeaderIndex.call(self, headerTitle);
    } else {
      return protractor.promise.rejected(new Error('No lines'));
    }

  }).then(function(headerIndex) {
    return getLineValuesByPage.call(self, headerIndex, totalPages);
  });
};

/**
 * Opens a line.
 *
 * @example
 *
 *     // With MyTablePage extending TablePage
 *     var page = new MyTablePage();
 *     page.logAsAdmin();
 *     page.load();
 *     page.openLine('My line').then(function() {
 *       console.log('My line opened');
 *     });
 *
 * @method openLine
 * @param {String} name The name of the line to open, each column of the line will be compared to this value
 * @return {Promise} Promise resolving when line is opened
 */
TablePage.prototype.openLine = function(name) {
  var self = this;

  return this.getLine(name).then(function(line) {

    // Click on the line to open it
    browserExt.click(line.tdElement);

    // Wait for the detail line
    return browser.wait(self.EC.presenceOf(self.lineDetailElement), 5000, 'Missing opened line');

  }).then(function() {
    return protractor.promise.fulfilled();
  });
};

/**
 * Closes opened line.
 *
 * @example
 *
 *     // With MyTablePage extending TablePage
 *     var page = new MyTablePage();
 *     page.logAsAdmin();
 *     page.load();
 *     page.closeLine('My line').then(function() {
 *       console.log('My line closed');
 *     });
 *
 * @method closeLine
 * @return {Promise} Promise resolving when line is closed
 */
TablePage.prototype.closeLine = function() {
  var self = this;
  var deferred = protractor.promise.defer();

  // Iterate on each line to find if one is an opened line
  this.rowElements.each(function(rowElement, index) {
    rowElement.getAttribute('class').then(function(classes) {
      classes = classes.split(' ');

      if (classes.indexOf('detail') >= 0) {

        // Found an opened line

        // Close it
        // Line is on the previous line because the detail is displayed in a new line
        browserExt.click(self.rowElements.get(--index));

        // Wait for the detail line to be closed
        return browser.wait(self.EC.stalenessOf(self.lineDetailElement), 5000, 'Line still opened');

      }
    });
  }).then(function() {
    return deferred.fulfill();
  });

  return deferred.promise;
};

/**
 * Tests if a line is opened.
 *
 * As only one line can be opened at a time, no name is required.
 *
 * @example
 *
 *     // With MyTablePage extending TablePage
 *     var page = new MyTablePage();
 *     page.logAsAdmin();
 *     page.load();
 *     page.isOpenedLine().then(function(isOpened) {
 *       console.log('Is a line opened ? ' + isOpened);
 *     });
 *
 * @method isOpenedLine
 * @return {Promise} Promise resolving with a boolean indicating if a line is opened or not
 */
TablePage.prototype.isOpenedLine = function() {
  var deferred = protractor.promise.defer();
  var isOpened = false;

  // Iterate on each line to find if one is an opened line
  this.rowElements.each(function(rowElement, index) {
    rowElement.getAttribute('class').then(function(classes) {
      classes = classes.split(' ');

      if (classes.indexOf('detail') >= 0)
        isOpened = true;
    });
  }).then(function() {
    deferred.fulfill(isOpened);
  });

  return deferred.promise;
};

/**
 * Selects a line.
 *
 * @example
 *
 *     // With MyTablePage extending TablePage
 *     var page = new MyTablePage();
 *     page.logAsAdmin();
 *     page.load();
 *     page.selectLine('My line').then(function() {
 *       console.log('My line is selected');
 *     });
 *
 * @method selectLine
 * @param {String} name The name of the line to select, each column of the line will be compared to this value
 * @return {Promise} Promise resolving when line is selected
 */
TablePage.prototype.selectLine = function(name) {
  return this.getLine(name).then(function(line) {

    // Click on line checkbox
    return browserExt.click(line.trElement.element(by.css('input[type="checkbox"]')));

  });
};

/**
 * Selects all lines.
 *
 * At least, one line must be in the table.
 *
 * @example
 *
 *     // With MyTablePage extending TablePage
 *     var page = new MyTablePage();
 *     page.logAsAdmin();
 *     page.load();
 *     page.selectAllLines().then(function() {
 *       console.log('All lines selected');
 *     });
 *
 * @method selectAllLines
 * @return {Promise} Promise resolving when all lines are selected
 */
TablePage.prototype.selectAllLines = function() {
  var self = this;
  return browserExt.click(this.selectAllElement).then(function() {
    return browser.wait(self.EC.visibilityOf(self.actionsButtonElement), 1000, 'Missing the list of actions');
  }).then(function() {
    return protractor.promise.fulfilled();
  });
};

/**
 * Sorts lines.
 *
 * @example
 *
 *     // With MyTablePage extending TablePage
 *     var page = new MyTablePage();
 *     page.logAsAdmin();
 *     page.load();
 *     page.sortBy('Name', true).then(function() {
 *       console.log('Lines sorted by Name');
 *     });
 *
 * @method sortBy
 * @param {String} name The value of the column to act on, each column will be compared to this value
 * @param {Boolean} asc true to sort in ascendant order, false to sort in descendant order
 * @return {Promise} Promise resolving when column is clicked
 */
TablePage.prototype.sortBy = function(name, asc) {
  var deferred = protractor.promise.defer();

  this.headerElements.filter(function(thElement, index) {
    return thElement.getText().then(function(text) {
      return text === name;
    });
  }).then(function(thElements) {
    if (thElements.length) {
      var thElement = thElements[0];

      // Header found
      thElement.element(by.className('glyphicon-triangle-bottom')).isPresent().then(function(isPresent) {

        if ((isPresent && asc) || (!isPresent && !asc)) {
          deferred.fulfill();
        } else {
          browserExt.click(thElement).then(function() {
            deferred.fulfill();
          }, function(error) {
            deferred.reject(error);
          });
        }

      });


    } else {
      deferred.reject(new Error('No header corresponding to ' + name));
    }
  });

  return deferred.promise;
};

/**
 * Performs an action on a single line.
 *
 * @example
 *
 *     // With MyTablePage extending TablePage
 *     var page = new MyTablePage();
 *     page.logAsAdmin();
 *     page.load();
 *     page.performAction('My line', 'Remove').then(function() {
 *       console.log('Action "Remove" has been performed on line "My line", confirmation dialog is opened');
 *     });
 *
 * @example
 *
 *     page.performAction('My line', 'Remove', true).then(function() {
 *       console.log('"My line" removed');
 *     });
 *
 * @method performAction
 * @param {String} name The value of the line to act on, each column of the line will be compared to this value
 * @param {String} action The translated name of the action to perform
 * @param {Boolean} [confirm=false] true to confirm the action, false otherwise
 * @return {Promise} Promise resolving when action is performed
 */
TablePage.prototype.performAction = function(name, action, confirm) {
  var self = this;

  return this.getLine(name).then(function(line) {
    var actionTd = line.trElement.all(by.css('td')).last();
    var actionButton = actionTd.element(by.css('button'));
    var actionElement = actionTd.element(by.cssContainingText('a', action));

    // Click on action button
    browserExt.click(actionButton);

    // Click on the desired action
    browserExt.click(actionElement);

    if (confirm) {
      browser.wait(self.EC.visibilityOf(self.dialogElement), 5000, 'Missing confirmation dialog');
      return self.confirmAction();
    } else
      return protractor.promise.fulfilled();
  });
};

/**
 * Performs a grouped action.
 *
 * At least one line must be selected.
 *
 * @example
 *
 *     // With MyTablePage extending TablePage
 *     var page = new MyTablePage();
 *     page.logAsAdmin();
 *     page.load();
 *     page.selectAllLines();
 *     page.performMultipleAction('Remove').then(function() {
 *       console.log('Action "Remove" performed on all selected lines, confirmation dialog is opened');
 *     });
 *
 * @example
 *
 *     page.performMultipleAction('Remove', true).then(function() {
 *       console.log('All lines removed');
 *     });
 *
 * @method performMultipleAction
 * @param {String} action The translated name of the action to perform
 * @param {Boolean} [confirm=false] true to confirm the action, false otherwise
 * @return {Promise} Promise resolving when the action is performed
 */
TablePage.prototype.performMultipleAction = function(action, confirm) {
  var self = this;
  return browserExt.click(this.actionsButtonElement).then(function() {
    browser.wait(self.EC.visibilityOf(self.actionsElement), 1000, 'Missing the list of actions');
    browserExt.click(self.actionsElement.element(by.cssContainingText('a', action)));

    if (confirm) {
      browser.wait(self.EC.visibilityOf(self.dialogElement), 5000, 'Missing confirmation dialog');
      return self.confirmAction();
    } else
      return protractor.promise.fulfilled();
  });
};

/**
 * Accepts the confirmation dialog.
 *
 * Confirmation dialog must be displayed.
 *
 * @example
 *
 *     // With MyTablePage extending TablePage
 *     var page = new MyTablePage();
 *     page.logAsAdmin();
 *     page.load();
 *     page.selectAllLines();
 *     page.performMultipleAction('Remove');
 *     page.confirmAction().then(function() {
 *       console.Log('Dialog confirmed, thus all selected lines are removed');
 *     });
 *
 * @method confirmAction
 * @return {Promise} Promise resolving when confirmation dialog has been accepted
 */
TablePage.prototype.confirmAction = function() {
  var self = this;
  return browserExt.click(this.dialogConfirmActionButtonElement).then(function() {
    return browser.wait(self.EC.stalenessOf(self.dialogElement), 5000, 'Dialog still visible');
  }).then(function() {
    return protractor.promise.fulfilled();
  });
};

/**
 * Cancels the confirmation dialog.
 *
 * Confirmation dialog must be displayed.
 *
 * @example
 *
 *     // With MyTablePage extending TablePage
 *     var page = new MyTablePage();
 *     page.logAsAdmin();
 *     page.load();
 *     page.selectAllLines();
 *     page.performMultipleAction('Remove');
 *     page.cancelAction().then(function() {
 *       console.Log('Remoe action canceled');
 *     });
 *
 * @method cancelAction
 * @return {Promise} Promise resolving when confirmation dialog has been canceled
 */
TablePage.prototype.cancelAction = function() {
  var self = this;
  return browserExt.click(this.dialogCancelActionButtonElement).then(function() {
    return browser.wait(self.EC.stalenessOf(self.dialogElement), 1000, 'Dialog still visible');
  }).then(function() {
    return protractor.promise.fulfilled();
  });
};

/**
 * Searches in the list of lines using search engine.
 *
 * Fills search fields.
 *
 * @example
 *
 *     // With MyTablePage extending TablePage
 *     var page = new MyTablePage();
 *     page.logAsAdmin();
 *     page.load();
 *
 *     var searchFieldsValues = {
 *       myField: 'Value'
 *     };
 *
 *     page.search(searchFieldsValues).then(function() {
 *       console.Log('Search done');
 *     });
 *
 * @method search
 * @param {Object} fields List of values for fields returned by method getSearchFields
 * @return {Promise} Promise resolving when search is done
 */
TablePage.prototype.search = function(values) {
  var promises = [];
  var fields = this.getSearchFields(this.searchFormElement);

  for (var fieldId in values)
    promises.push(fields[fieldId].setValue(values[fieldId]));

  return protractor.promise.all(promises);
};

/**
 * Clears search fields.
 *
 * @example
 *
 *     // With MyTablePage extending TablePage
 *     var page = new MyTablePage();
 *     page.logAsAdmin();
 *     page.load();
 *     page.clearSearch().then(function() {
 *       console.Log('Search engine cleared');
 *     });
 *
 * @method clearSearch
 * @return {Promise} Promise resolving when fields are cleared
 */
TablePage.prototype.clearSearch = function() {
  var promises = [];
  var fields = this.getSearchFields(this.searchFormElement);

  for (var fieldId in fields)
    promises.push(fields[fieldId].setValue());

  return protractor.promise.all(promises);
};

/**
 * Opens search engine.
 *
 * @example
 *
 *     // With MyTablePage extending TablePage
 *     var page = new MyTablePage();
 *     page.logAsAdmin();
 *     page.load();
 *     page.openSearchEngine().then(function() {
 *       console.log('Search engine opened');
 *     });
 *
 * @method openSearchEngine
 * @return {Promise} Promise resolving when search engine is opened
 */
TablePage.prototype.openSearchEngine = function() {
  var self = this;

  return this.searchFormElement.isDisplayed().then(function(isDisplayed) {
    if (!isDisplayed) {

      // Open search engine
      browserExt.click(self.searchLinkElement);

      return browser.wait(self.EC.visibilityOf(self.searchFormElement), 1000, 'Missing search form');

    } else {

      // Search engine is already displayed
      return protractor.promise.fulfilled();

    }
  }).then(function() {
    return protractor.promise.fulfilled();
  });
};

/**
 * Closes search engine.
 *
 * @example
 *
 *     // With MyTablePage extending TablePage
 *     var page = new MyTablePage();
 *     page.logAsAdmin();
 *     page.load();
 *     page.closeSearchEngine().then(function() {
 *       console.log('Search engine closed');
 *     });
 *
 * @method closeSearchEngine
 * @return {Promise} Promise resolving when search engine is closed
 */
TablePage.prototype.closeSearchEngine = function() {
  var self = this;

  return this.searchFormElement.isDisplayed().then(function(isDisplayed) {
    if (isDisplayed) {

      // Close search engine
      browserExt.click(self.searchLinkElement);

      // Wait for the search engine to be invisible
      return browser.wait(self.EC.invisibilityOf(self.searchFormElement), 1000, 'Search engine still visible');
    } else {

      // Search engine is already closed
      return protractor.promise.fulfilled();

    }
  }).then(function() {
    return protractor.promise.fulfilled();
  });
};

/**
 * Gets current page number.
 *
 * @example
 *
 *     // With MyTablePage extending TablePage
 *     var page = new MyTablePage();
 *     page.logAsAdmin();
 *     page.load();
 *     page.getCurrentPage().then(function(currentPage) {
 *       console.log('Current page is ' + currentPage);
 *     });
 *
 * @method getCurrentPage
 * @return {Promise} Promise resolving with the current page (starting at 1)
 */
TablePage.prototype.getCurrentPage = function() {
  return this.currentPageElement.getText().then(function(currentPage) {
    return protractor.promise.fulfilled(parseInt(currentPage));
  });
};

/**
 * Gets total number of pages.
 *
 * @example
 *
 *     // With MyTablePage extending TablePage
 *     var page = new MyTablePage();
 *     page.logAsAdmin();
 *     page.load();
 *     page.getTotalPages().then(function(totalPages) {
 *       console.log('There are ' + totalPages + ' pages');
 *     });
 *
 * @method getTotalPages
 * @return {Promise} Promise resolving with the total number of pages
 */
TablePage.prototype.getTotalPages = function() {
  return this.totalPagesElement.getText().then(function(totalPages) {
    return protractor.promise.fulfilled(parseInt(totalPages));
  });
};

/**
 * Gets total number of lines.
 *
 * @example
 *
 *     // With MyTablePage extending TablePage
 *     var page = new MyTablePage();
 *     page.logAsAdmin();
 *     page.load();
 *     page.getTotalLines().then(function(totalLines) {
 *       console.log('There are ' + totalLines + ' lines');
 *     });
 *
 * @method getTotalLines
 * @return {Promise} Promise resolving with the total number of lines
 */
TablePage.prototype.getTotalLines = function() {
  return this.totalLinesElement.getText().then(function(totalLines) {
    return protractor.promise.fulfilled(parseInt(totalLines));
  });
};

/**
 * Gets the total number of page links.
 *
 * Gets the number of page links in the pagination.
 *
 * @example
 *
 *     // With MyTablePage extending TablePage
 *     var page = new MyTablePage();
 *     page.logAsAdmin();
 *     page.load();
 *     page.getTotalPaginationLinks().then(function(totalLinks) {
 *       console.log('There are ' + totalLinks + ' pagination links');
 *     });
 *
 * @method getTotalPaginationLinks
 * @return {Promise} Promise resolving with the total number of links
 */
TablePage.prototype.getTotalPaginationLinks = function() {
  return this.paginationLinkElements.count().then(function(count) {
    var totalLinks = count - 2;
    return protractor.promise.fulfilled(totalLinks);
  });
};

/**
 * Selects the first page in pagination.
 *
 * @example
 *
 *     // With MyTablePage extending TablePage
 *     var page = new MyTablePage();
 *     page.logAsAdmin();
 *     page.load();
 *     page.selectFirstPage().then(function() {
 *       console.log('First page selected');
 *     });
 *
 * @method selectFirstPage
 * @return {Promise} Promise resolving when first page is selected
 */
TablePage.prototype.selectFirstPage = function() {
  return this.selectPage(1);
};

/**
 * Selects the last page in pagination.
 *
 * @example
 *
 *     // With MyTablePage extending TablePage
 *     var page = new MyTablePage();
 *     page.logAsAdmin();
 *     page.load();
 *     page.selectLastPage().then(function() {
 *       console.log('Last page selected');
 *     });
 *
 * @method selectLastPage
 * @return {Promise} Promise resolving when last page is selected
 */
TablePage.prototype.selectLastPage = function() {
  var self = this;

  return this.getTotalPages().then(function(totalPages) {
    return self.selectPage(totalPages);
  });
};

/**
 * Selects a page in pagination.
 *
 * @example
 *
 *     // With MyTablePage extending TablePage
 *     var page = new MyTablePage();
 *     page.logAsAdmin();
 *     page.load();
 *     page.selectPage(5).then(function() {
 *       console.log('Page 5 selected');
 *     });
 *
 * @method selectPage
 * @param {Number} page The page to select (starting at 1)
 * @return {Promise} Promise resolving when page is selected
 */
TablePage.prototype.selectPage = function(page) {
  var self = this;
  return this.selectFirstPageRange().then(function() {
    return selectPageByRange.call(self, page);
  });
};

/**
 * Selects first page range in pagination.
 *
 * @example
 *
 *     // With MyTablePage extending TablePage
 *     var page = new MyTablePage();
 *     page.logAsAdmin();
 *     page.load();
 *     page.selectFirstPageRange().then(function() {
 *       console.log('First range selected');
 *     });
 *
 * @method selectFirstPageRange
 * @return {Promise} Promise resolving when first page range is selected
 */
TablePage.prototype.selectFirstPageRange = function() {
  var self = this;

  return this.isPreviousRangeLinkEnabled().then(function(isEnabled) {
    if (isEnabled) {
      self.selectPreviousPageRange();
      return self.selectFirstPageRange();
    } else {

      // Already in first range
      return protractor.promise.fulfilled();

    }
  });
};

/**
 * Selects last page range in pagination.
 *
 * @example
 *
 *     // With MyTablePage extending TablePage
 *     var page = new MyTablePage();
 *     page.logAsAdmin();
 *     page.load();
 *     page.selectLastPageRange().then(function() {
 *       console.log('Last range selected');
 *     });
 *
 * @method selectLastPageRange
 * @return {Promise} Promise resolving when last page range is selected
 */
TablePage.prototype.selectLastPageRange = function() {
  var self = this;

  return this.isNextRangeLinkEnabled().then(function(isEnabled) {
    if (isEnabled) {

      self.selectNextPageRange();
      return self.selectLastPageRange();

    } else {

      // Already in first range
      return protractor.promise.fulfilled();

    }
  });
};

/**
 * Selects previous page range in pagination.
 *
 * @example
 *
 *     // With MyTablePage extending TablePage
 *     var page = new MyTablePage();
 *     page.logAsAdmin();
 *     page.load();
 *     page.selectPreviousPageRange().then(function() {
 *       console.log('Previous range selected');
 *     });
 *
 * @method selectPreviousPageRange
 * @return {Promise} Promise resolving when previous page range is selected
 */
TablePage.prototype.selectPreviousPageRange = function() {
  return browserExt.click(this.paginationPreviousRangeElement);
};

/**
 * Selects next page range in pagination.
 *
 * @example
 *
 *     // With MyTablePage extending TablePage
 *     var page = new MyTablePage();
 *     page.logAsAdmin();
 *     page.load();
 *     page.selectNextPageRange().then(function() {
 *       console.log('Next range selected');
 *     });
 *
 * @method selectNextPageRange
 * @return {Promise} Promise resolving when next page range is selected
 */
TablePage.prototype.selectNextPageRange = function() {
  return browserExt.click(this.paginationNextRangeElement);
};

/**
 * Tests if previous page range link is enabled.
 *
 * @example
 *
 *     // With MyTablePage extending TablePage
 *     var page = new MyTablePage();
 *     page.logAsAdmin();
 *     page.load();
 *     page.isPreviousRangeLinkEnabled().then(function(isEnabled) {
 *       console.log('Is previous range link enabled ?' + isEnabled);
 *     });
 *
 * @method isPreviousRangeLinkEnabled
 * @return {Promise} Promise resolving whith a boolean indicating if the previous range link is enabled
 */
TablePage.prototype.isPreviousRangeLinkEnabled = function() {
  return this.paginationPreviousRangeElement.getAttribute('class').then(function(classes) {
    classes = classes.split(' ');
    return protractor.promise.fulfilled(classes.indexOf('disabled') < 0);
  });
};

/**
 * Tests if next page range link is enabled.
 *
 * @example
 *
 *     // With MyTablePage extending TablePage
 *     var page = new MyTablePage();
 *     page.logAsAdmin();
 *     page.load();
 *     page.isNextRangeLinkEnabled().then(function(isEnabled) {
 *       console.log('Is next range link enabled ?' + isEnabled);
 *     });
 *
 * @method isNextRangeLinkEnabled
 * @return {Promise} Promise resolving whith a boolean indicating if the next range link is enabled
 */
TablePage.prototype.isNextRangeLinkEnabled = function() {
  return this.paginationNextRangeElement.getAttribute('class').then(function(classes) {
    classes = classes.split(' ');
    return protractor.promise.fulfilled(classes.indexOf('disabled') < 0);
  });
};

/**
 * Sets the desired number of lines to display in the table.
 *
 * @example
 *
 *     // With MyTablePage extending TablePage
 *     var page = new MyTablePage();
 *     page.logAsAdmin();
 *     page.load();
 *     page.setLinesNumber(20).then(function() {
 *       console.log('20 lines are now displayed per page');
 *     });
 *
 * @method setLinesNumber
 * @param {Number} linesNumbers Either 5, 10, 20 or 30
 * @return {Promise} Promise resolving when the expected number of lines is set
 */
TablePage.prototype.setLinesNumber = function(linesNumber) {
  var deferred = protractor.promise.defer();

  this.itemsPerPageLinkElements.filter(function(link, index) {
    return link.getText().then(function(text) {
      return text == linesNumber;
    });
  }).then(function(links) {
    if (links.length) {
      var link = links[0];

      link.getAttribute('class').then(function(classes) {
        classes = classes.split(' ');
        if (classes.indexOf('active') >= 0) {
          deferred.fulfill();
        } else {
          browserExt.click(link).then(function() {
            deferred.fulfill();
          }, function(error) {
            deferred.reject(error);
          });
        }
      });
    } else {
      deferred.reject(new Error('No element found for ' + linesNumber + ' items per page'));
    }
  }).then(function(error) {
    deferred.reject(error);
  });

  return deferred.promise;
};

/**
 * Moves the cursor over the "select all" checkbox to display the information popover.
 *
 * @example
 *
 *     // With MyTablePage extending TablePage
 *     var page = new MyTablePage();
 *     page.logAsAdmin();
 *     page.load();
 *     page.setSelectAllMouseOver().then(function() {
 *       console.log('Mouse over the "select all" checkbox');
 *     });
 *
 * @method setSelectAllMouseOver
 * @return {Promise} Promise resolving when the mouse is over the "select all" checkbox
 */
TablePage.prototype.setSelectAllMouseOver = function() {
  var self = this;

  return browser.actions().mouseMove(this.selectAllElement).perform().then(function() {
    return browser.wait(self.EC.presenceOf(self.popoverElement), 1000, 'Missing dialog over select all checkbox');
  }).then(function() {
    return protractor.promise.fulfilled();
  });
};

/**
 * Tests if a header exists.
 *
 * @example
 *
 *     // With MyTablePage extending TablePage
 *     var page = new MyTablePage();
 *     page.logAsAdmin();
 *     page.load();
 *     page.isTableHeader('Action').then(function(isHeader) {
 *       console.log('Is there a column title named "Action" ? ' + isHeader);
 *     });
 *
 * @method isTableHeader
 * @param {String} name The title of the header to look for
 * @return {Promise} Promise resolving with a boolean indicating if the table header exists or not
 */
TablePage.prototype.isTableHeader = function(name) {
  var deferred = protractor.promise.defer();

  this.headerElements.filter(function(thElement, index) {
    return thElement.getText().then(function(text) {
      return text === name;
    });
  }).then(function(thElements) {
    deferred.fulfill(thElements.length ? true : false);
  });

  return deferred.promise;
};

/**
 * Removes a line.
 *
 * @example
 *
 *     // With MyTablePage extending TablePage
 *     var page = new MyTablePage();
 *     page.logAsAdmin();
 *     page.load();
 *     page.removeLine('My line').then(function() {
 *       console.log('Line removed');
 *     });
 *
 * @method removeLine
 * @param {String} name The name of the line to remove
 * @return {Promise} Promise resolving when the line has been removed
 */
TablePage.prototype.removeLine = function(name) {
  return this.performAction(name, this.translations.UI.REMOVE, true);
};

/**
 * Removes all lines in the page.
 *
 * @example
 *
 *     // With MyTablePage extending TablePage
 *     var page = new MyTablePage();
 *     page.logAsAdmin();
 *     page.load();
 *     page.removeAllLinesInPage().then(function() {
 *       console.log('All lines in the page have been removed');
 *     });
 *
 * @method removeAllLinesInPage
 * @return {Promise} Promise resolving when lines have been removed
 */
TablePage.prototype.removeAllLinesInPage = function() {
  var self = this;

  return this.selectAllLines().then(function() {
    return self.removeAllSelectedLinesInPage();
  });
};

/**
 * Removes all selected lines in the page.
 *
 * @example
 *
 *     // With MyTablePage extending TablePage
 *     var page = new MyTablePage();
 *     page.logAsAdmin();
 *     page.load();
 *     page.removeAllLinesInPage().then(function() {
 *       console.log('Selected lines in the page have been removed');
 *     });
 *
 * @method removeAllSelectedLinesInPage
 * @return {Promise} Promise resolving when lines have been removed
 */
TablePage.prototype.removeAllSelectedLinesInPage = function() {
  return this.performMultipleAction(this.translations.UI.REMOVE, true);
};

/**
 * Adds multiple lines at the same time.
 *
 * This method bypass the web browser to directly add lines into database.
 * Using this method will reload the page.
 *
 * @method addLinesByPass
 * @param {Array} lines A list of lines to add
 * @return {Promise} Promise resolving when lines are added and browser page has been reloaded
 */
TablePage.prototype.addLinesByPass = function(lines) {
  var self = this;
  var deferred = protractor.promise.defer();
  var parallel = [];
  var addedLines = [];

  // Create function for async to add a line to the database
  function createAddFunction(line) {

    // Add function to the list of functions to execute in parallel
    parallel.push(function(callback) {

      // Add line
      self.model.add(line, function(error, addedLine) {
        addedLines.push(addedLine);
        callback(error);
      });

    });
  }

  // Create functions to add lines with async
  for (var i = 0; i < lines.length; i++)
    createAddFunction(lines[i]);

  // Nothing to add
  if (!parallel.length)
    return protractor.promise.fulfilled(addedLines);

  // Asynchonously create lines
  async.parallel(parallel, function(error) {
    if (error) {
      throw error;
    } else {
      self.refresh().then(function() {
        deferred.fulfill(addedLines);
      }, function() {
        deferred.reject();
      });
    }
  });

  return deferred.promise;
};

/**
 * Adds multiple lines at the same time with automatic index.
 *
 * This method bypass the web browser to directly add lines into database.
 * Using this method will reload the page.
 *
 * All created lines will have the same name suffixed by the index.
 *
 * @example
 *
 *     // With MyTablePage extending TablePage
 *     var page = new MyTablePage();
 *     page.logAsAdmin();
 *     page.load();
 *     page.addLinesByPassAuto('My line', 2).then(function(lines) {
 *       console.log('Line "My line 0" created');
 *       console.log('Line "My line 1" created');
 *       console.log(lines);
 *     });
 *
 * @example
 *
 *     page.addLinesByPassAuto('My line', 2, 2).then(function(lines) {
 *       console.log('Line "My line 2" created');
 *       console.log('Line "My line 3" created');
 *       console.log(lines);
 *     });
 *
 * @method addLinesByPassAuto
 * @param {String} name Base name of the lines to add
 * @param {Number} total Number of lines to add
 * @param {Number} [offset=0] Index to start from for the name suffix
 * @return {Promise} Promise resolving with the added lines and when browser page has been reloaded
 */
TablePage.prototype.addLinesByPassAuto = function(name, total, offset) {
  var lines = [];
  offset = offset || 0;

  for (var i = offset; i < total; i++)
    lines.push({name: name + ' ' + i});

  return this.addLinesByPass(lines);
};

/**
 * Removes multiple lines at the same time.
 *
 * This method bypass the web browser to directly remove lines from database.
 * Using this method will reload the page.
 *
 * @method removeLinesByPass
 * @param {Array} lines A list of lines
 * @return {Promise} Promise resolving when lines are removed and browser page has been reloaded
 */
TablePage.prototype.removeLinesByPass = function(lines) {
  var self = this;
  var deferred = protractor.promise.defer();
  var lineIds = [];

  for (var i = 0; i < lines.length; i++)
    lineIds.push(lines[i].id);

  // Nothing to remove
  if (!lineIds.length)
    return protractor.promise.fulfilled();

  this.model.remove(lineIds, function(error) {
    if (error) {
      throw error;
    } else {
      self.refresh().then(function() {
        deferred.fulfill();
      }, function() {
        deferred.reject();
      });
    }
  });

  return deferred.promise;
};

/**
 * Tests if the edition form is in error.
 *
 * @example
 *
 *     // With MyTablePage extending TablePage
 *     var page = new MyTablePage();
 *     page.logAsAdmin();
 *     page.load();
 *     page.isEditionFormOnError().then(function(isOnError) {
 *       console.log('Is edition form on error ? ' + isOnError);
 *     });
 *
 * @method isEditionFormOnError
 * @return {Promise} Promise resolving with a boolean indicating if the edition form is on error
 */
TablePage.prototype.isEditionFormOnError = function() {
  return this.getEditionFormErrors().then(function(errors) {
    return protractor.promise.fulfilled(errors.length ? true : false);
  });
};

/**
 * Gets the list of edition form error messages.
 *
 * @example
 *
 *     // With MyTablePage extending TablePage
 *     var page = new MyTablePage();
 *     page.logAsAdmin();
 *     page.load();
 *     page.getEditionFormErrors().then(function(errors) {
 *       console.log(errors);
 *     });
 *
 * @method getEditionFormErrors
 * @return {Promise} Promise resolving with the list of errors
 */
TablePage.prototype.getEditionFormErrors = function() {
  var fields = this.getEditFormFields(this.lineDetailElement.element(by.css('.detail')));
  var promises = [];

  for (var fieldName in fields) {
    var field = fields[fieldName];
    promises.push(field.getErrorMessage());
  }

  return protractor.promise.all(promises).then(function(errors) {
    errors = errors.filter(function(text) {
      return text;
    });
    return protractor.promise.fulfilled(errors);
  });
};

/**
 * Adds a new line.
 *
 * User must be logged and have permission to create line on this page.
 *
 * @method addLine
 * @param {String} name Line name
 * @param {Object} [data] Additional data depending on page type
 * @return {Promise} Promise resolving when the line has been added
 */
TablePage.prototype.addLine = function(name, data) {
  throw new Error('addLine method is not implemented for this page');
};

/**
 * Gets search engine fields.
 *
 * @param {ElementFinder} Search engine form element
 * @return {Object} The list of fields
 */
TablePage.prototype.getSearchFields = function(form) {
  throw new Error('Method getSearchFields not implemented for this page');
};

/**
 * Gets add form fields.
 *
 * @method getAddFormFields
 * @param {ElementFinder} Add form element
 * @return {Object} The list of fields
 */
TablePage.prototype.getAddFormFields = function(form) {
  throw new Error('Method getAddFormFields not implemented for this page');
};

/**
 * Gets edit form fields.
 *
 * @method getEditFormFields
 * @param {ElementFinder} Edit form element
 * @return {Obect} The list of fields
 */
TablePage.prototype.getEditFormFields = function(form) {
  throw new Error('Method getEditFormFields not implemented for this page');
};