'use strict';

var commentProcessing = require('comment-processing');
var util = require('util');
var uglify = require('uglify-js');
var mkdirp = require('mkdirp-promise');
var path = require('path');
var fs = require('fs');

var UglifyInstruction = function UglifyInstruction(sourceRoot, targetRoot) {
  sourceRoot = sourceRoot || '.';
  targetRoot = targetRoot || '.';
  if (!(this instanceof UglifyInstruction)) {
    return new UglifyInstruction(sourceRoot, targetRoot);
  }
  commentProcessing.AggregateInstruction.call(this, function(sourceFiles, targetFile) {
    var uglified = uglify.minify(sourceFiles.map(function(sourceFile) {
      return path.join(sourceRoot, sourceFile);
    }));
    targetFile = path.join(targetRoot, targetFile);
    mkdirp(path.dirname(targetFile)).then(function() {
      fs.writeFile(targetFile, uglified.code);
    });
  });
};
util.inherits(UglifyInstruction, commentProcessing.AggregateInstruction);

module.exports = UglifyInstruction;
module.exports.factory = function(sourceRoot, targetRoot) {
  return function() {
    return new UglifyInstruction(sourceRoot, targetRoot);
  };
};
