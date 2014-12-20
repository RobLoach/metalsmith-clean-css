'use strict';

var path = require('path');

var CleanCSS = require('clean-css');
var minimatch = require('minimatch');

/**
 * A Metalsmith plugin to concatenate and minify CSS files.
 */
module.exports = function plugin(options) {
  options = options || {};
  options.files = (typeof options.files === 'string') ? options.files : '**/*.css';
  options.cleanCSS = options.cleanCSS || {};
  var cleanCSS = new CleanCSS(options.cleanCSS);

  /**
   *
   * @param {Object} files
   * @param {Metalsmith} metalsmith
   * @param {Function} done
   */
  return function(files, metalsmith, done) {
    Object.keys(files).forEach(function(filepath) {
      if (!minimatch(filepath, options.files)) { return; }

      var minified = cleanCSS.minify(files[filepath].contents);
      var sourcemapFilepath = filepath + '.' + 'map';

      if (minified.errors.length > 0) {
        return done(minified.errors[0]);
      }

      files[filepath].contents = minified.styles;

      if (minified.sourceMap) {
        files[filepath].contents += [
          '/*# sourceMappingURL=', path.basename(sourcemapFilepath), ' */'
        ].join('');

        // fix sources
        minified.sourceMap = JSON.parse(minified.sourceMap.toString());
        minified.sourceMap.sources = [path.basename(filepath)];

        files[sourcemapFilepath] = files[sourcemapFilepath] || {};
        files[sourcemapFilepath].contents = JSON.stringify(minified.sourceMap);
      }
    });

    return done();
  };
};
