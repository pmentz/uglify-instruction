/*jshint mocha: true */
/*jshint expr: true */
'use strict';

var expect = require('chai').expect;
var commentProcessing = require('comment-processing');
var UglifyInstruction = require('../index.js');
var rimraf = require('rimraf');
var mkdirp = require('mkdirp-promise');
var path = require('path');
var fs = require('fs');

// Polyfill promise for node v0.10 tests
require('es6-promise').polyfill();

describe('uglify-instruction', function() {
  before(function(done) {
    this.sampleDir = path.join(__dirname, 'resources', 'sample');
    this.expectedDir = path.join(__dirname, 'resources', 'expected');
    this.outputDir = path.join(__dirname, 'resources', 'output', 'index');

    rimraf.sync(this.outputDir);
    mkdirp(this.outputDir).then(function() {
      done();
    });
  });

  it('exists', function() {
    expect(UglifyInstruction).to.be.a('function');
  });

  it('is an AggregateInstruction', function() {
    expect(new UglifyInstruction()).to.be.an.instanceof(commentProcessing.AggregateInstruction);
  });

  it('handles Ctor used as factory', function() {
    /* jshint newcap: false */
    expect(UglifyInstruction()).to.be.an.instanceof(UglifyInstruction);
  });

  it('uglifies the files aggregated', function(done) {
    var processing = commentProcessing();
    processing.addInstruction('uglify', UglifyInstruction.factory(this.sampleDir, this.outputDir));
    processing.transformFile(path.join(this.sampleDir, 'example.html'),
                             path.join(this.outputDir, 'example.html')).then(function() {
      expect(fs.readFileSync(path.join(this.outputDir, 'script', 'application.js'), 'utf-8')).to.equal(
             fs.readFileSync(path.join(this.expectedDir, 'uglified.js'), 'utf-8'));
      done();
    }.bind(this)).catch(function(error) {
      done(error);
    });
  });

  it('hands over config to uglify', function(done) {
    var processing = commentProcessing();
    processing.addInstruction('uglify', UglifyInstruction.factory(this.sampleDir, this.outputDir, {mangle: false}));
    processing.transformFile(path.join(this.sampleDir, 'example_withOptions.html'),
                             path.join(this.outputDir, 'example_withOptions.html')).then(function() {
      expect(fs.readFileSync(path.join(this.outputDir, 'script', 'application_withOptions.js'), 'utf-8')).to.equal(
             fs.readFileSync(path.join(this.expectedDir, 'uglified_withOptions.js'), 'utf-8'));
      done();
    }.bind(this)).catch(function(error) {
      done(error);
    });

  });

  it('has a factory method that returns an AggregateInstruction', function() {
    expect(UglifyInstruction.factory).to.be.a('function');
    expect(UglifyInstruction.factory()()).to.be.an.instanceof(UglifyInstruction);
  });
});
