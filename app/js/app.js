/**
 * Copyright (c) 2013 JeongHoon Byun aka "Outsider", <http://blog.outsider.ne.kr/>
 * Licensed under the MIT license.
 * <http://outsider.mit-license.org/>
 */
'use strict';

angular.module('githug', [])
  .config(['$routeProvider', function($routeProvider) {
    $routeProvider.
      when('/install', {templateUrl: 'partials/install.html'}).
      when('/signin', {templateUrl: 'partials/signin.html'}).
      otherwise({redirectTo: '/'});
  }])
  .run(function($location) {
    if (!window.navigator.standalone) {
      $location.path('/install');
    } else {
      $location.path('/signin');
    }
  });
