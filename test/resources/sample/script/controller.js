'use strict';

/* global angular: false */
angular.module('test')
.controller('TestCtrl', function() {
  this.foo = 'bar';
  this.greet = function(name) {
    return 'Hello ' + name;
  };
});
