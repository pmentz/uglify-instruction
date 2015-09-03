'use strict';

var commentProcessing = require('comment-processing');
var fs = require('fs');
var mkdirp = require('mkdirp-promise');
var path = require('path');
var uglifyjs = require('uglify-js');
var uglifycss = require('uglifycss');
var util = require('util');

var UglifyInstruction = function UglifyInstruction(sourceRoot, targetRoot, uglifyConfig) {
  sourceRoot = sourceRoot || '.';
  targetRoot = targetRoot || '.';

  if (!(this instanceof UglifyInstruction)) {
    return new UglifyInstruction(sourceRoot, targetRoot, uglifyConfig);
  }
  commentProcessing.AggregateInstruction.call(this, function(sourceFiles, targetFile) {
    if (this.hasCssTarget()) {
      var uglifiedJS = uglifycss.processFiles(sourceFiles.map(function(sourceFile) {
        return path.join(sourceRoot, sourceFile);
      }), uglifyConfig);
      targetFile = path.join(targetRoot, targetFile);
      mkdirp(path.dirname(targetFile)).then(function() {
        fs.writeFile(targetFile, uglifiedJS);
      });
    } else {
      var uglifiedCSS = uglifyjs.minify(sourceFiles.map(function(sourceFile) {
        return path.join(sourceRoot, sourceFile);
      }), uglifyConfig);
      targetFile = path.join(targetRoot, targetFile);
      mkdirp(path.dirname(targetFile)).then(function() {
        fs.writeFile(targetFile, uglifiedCSS.code);
      });
    }
  });
};
util.inherits(UglifyInstruction, commentProcessing.AggregateInstruction);

module.exports = UglifyInstruction;
module.exports.factory = function(sourceRoot, targetRoot, uglifyConfig) {
  return function() {
    return new UglifyInstruction(sourceRoot, targetRoot, uglifyConfig);
  };
};
