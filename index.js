'use strict';

var path = require('path');

// Set module root directory
process.rootTest = __dirname;
process.requireTest = function(filePath) {
  return require(path.join(process.rootTest, filePath));
};

module.exports.unit = process.requireTest('lib/unit/unit.js');
module.exports.e2e = process.requireTest('lib/e2e/e2e.js');
module.exports.util = process.requireTest('lib/util.js');
