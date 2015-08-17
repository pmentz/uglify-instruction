[![Build Status][buildstatus-img]][buildstatus-url] [![Coverage Status][coverage-img]][coverage-url] [![Dependency Status][dependency-img]][dependency-url] [![devDependency Status][devDependency-img]][devDependency-url] [![experimental][experimental-img]][stability-url]  
[![NPM][nodei-img]][nodei-url]

# uglify-instruction
Instruction for [comment-processing][], that uses [uglify-js][] to squash javascript files.

## Installation

* You need to have [npm][npm] installed.  
* Use 
    * `npm install uglify-instruction` to retrieve the module or 
    * `npm install uglify-instruction -S` to save the dependency to your package.json.
* *If you are using Node <= v0.10.0 you will need a [Promise polyfill][es6-promise]*

## Guide

This is an instruction for [comment-processing][], refer to its documentation to find out more.

The UglifyInstruction is a special implementation of the AggregateInstruction, that allows to use [uglify-js][] for a
set of resources to concat and compress them.  
It is provided as a separate module, to separate its external dependencies just for those who really need it.

The guide of the comment-processing already included a simple example of a callback for the AggregateInstruction. This
is a more generic implementation and only needs configuration.

So I have written my application, which is based on several javascript files what is typical g.e. for Angular apps.

```html
<!DOCTYPE html>
<html>
  <head>
    <meta http-equiv="x-ua-compatible" content="ie=edge">
    <title>Example</title>
    <meta name="description" content="UglifyInstruction sample">
    <meta name="viewport" content="width=device-width, initial-scale=1">
  </head>
  
  <body>
    <!-- uglify:start script/application.js -->
    <script src="script/module.js"></script>
    <script src="script/controller.js"></script>
    <!-- uglify:end -->
  </body>
</html>
```

As you can see, I surrounded my sources with a start end end comment, referencing the uglify instruction, as well as 
the name of the file to create.

```javascript
var commentProcessing = require('comment-processing')();
var UglifyInstruction = require('uglify-instruction');
commentProcessing.addInstruction('uglify', UglifyInstruction.factory('src', 'dist/public'));
commentProcessing.transformFile('src/index.html', 'dist/public/index.html');
```

So this is basically just adding the UglifyInstruction to the registry of the comment-processing. Like the 
AggregateInstruction, it provides a factory method, which will return a function, that will return a configured instance
of the UglifyInstruction when called. Remember, that you have to hand over factory methods to the registry and not
already created instances.

Two mandatory parameters are the paths used to locate the source files for the transformation and the directory to write the uglified
file into.
Additionally, you can add a third parameter which is the configuration for [uglify-js][], it will be handed over to
uglify as it is, so take a look at its configuration.

## API

### uglifyInstruction.factory(sourceDirectory, targetDirectory, [uglifyConfig])

A factory method, which will return a function, that will return a configured instance of the UglifyInstruction when
called. Remember, that you have to hand over factory methods to the registry and not already created instances.

## License

MIT

[npm]:http://npmjs.org/
[comment-processing]: https://www.npmjs.com/package/comment-processing
[uglify-js]: https://www.npmjs.com/package/uglify-js
[es6-promise]: https://www.npmjs.com/package/es6-promise

[buildstatus-img]: https://travis-ci.org/pmentz/uglify-instruction.svg?branch=master
[buildstatus-url]: https://travis-ci.org/pmentz/uglify-instruction
[coverage-img]: https://coveralls.io/repos/pmentz/uglify-instruction/badge.svg?service=github&branch=master
[coverage-url]: https://coveralls.io/github/pmentz/uglify-instruction?branch=master
[dependency-img]: https://david-dm.org/pmentz/uglify-instruction.svg
[dependency-url]: https://david-dm.org/pmentz/uglify-instruction
[devDependency-img]: https://david-dm.org/pmentz/uglify-instruction/dev-status.svg
[devDependency-url]: https://david-dm.org/pmentz/uglify-instruction#info=devDependencies
[experimental-img]: https://img.shields.io/badge/stability-1%20--%20experimental-orange.svg?style=flat-round
[stability-url]: https://iojs.org/api/documentation.html#documentation_stability_index
[nodei-img]: https://nodei.co/npm/uglify-instruction.png?compact=true
[nodei-url]: https://nodei.co/npm/uglify-instruction/
