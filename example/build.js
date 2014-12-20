'use strict';

var Metalsmith = require('metalsmith');
var cleanCSS = require('../lib'); // require('metalsmith-clean-css');

(new Metalsmith(__dirname))
  .use(cleanCSS({ cleanCSS: { sourceMap: true } }))
  .build(function(err) { if (err) { throw err; } })
;
