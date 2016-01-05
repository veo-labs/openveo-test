'use strict';

module.exports = {

  // Test documentation
  doc: {
    name: 'OpenVeo test API',
    description: 'Unit tests and end to end tests API for OpenVeo',
    version: '<%= pkg.version %>',
    options: {
      paths: 'lib',
      outdir: './site/<%= pkg.version %>',
      linkNatives: true,
      themedir: 'node_modules/yuidoc-theme-blue'
    }
  }

};
