'use strict';

/**
 * Exposes a list of functions to help writing tests.
 *
 * @module util
 * @main util
 * @class util
 */

/**
 * Executes a function then call done function.
 *
 * Exception thrown by the function are catched and transmitted to the done function.
 *
 * Chai throws exceptions while an assertion fails which makes difficult writing ansynchronous tests.
 * Assertions in asynchronous tests must be surrounding by try/catch and call the Mocha done callback with the
 * error in case of a failing assertion.
 *
 * @param {Function} testFunction The function to execute
 * @param {Function} done The function to call after executing the testFunction function
 * @param {Boolean] [doNotTerminate=false] Indicates if done function must not be called after executing the
 * testFunction function
 */
module.exports.check = function(testFunction, done, doNotTerminate) {
  try {
    testFunction();

    if (!doNotTerminate)
      done();
  } catch (error) {
    done(error);
  }
};
