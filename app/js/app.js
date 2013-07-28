/**
 * Copyright (c) 2013 JeongHoon Byun aka "Outsider", <http://blog.outsider.ne.kr/>
 * Licensed under the MIT license.
 * <http://outsider.mit-license.org/>
 */
'use strict';

(function() {
  window.githubApp = angular.module('githug', [])
    .config(['$routeProvider', function($routeProvider) {
      $routeProvider.
        when('/install', {templateUrl: 'partials/install.html'}).
        when('/signin', {templateUrl: 'partials/signin.html', controller: SignInCtrl}).
        when('/timeline', {templateUrl: 'partials/timeline.html', controller: TimelineCtrl}).
        otherwise({redirectTo: '/'});
    }])
    .run(function($location, env, github) {
      if (!window.navigator.standalone) {
        $location.path('/install');
      } else {
        var isSignIn = localStorage.getItem('token');
        if (isSignIn) {
          $location.path('/timeline');
        } else {
          $location.path('/signin');
        }
        OAuth.callback('github', function(err, result) {
          if (err) { return alert(err); }

          env.user('token', result.access_token);
          env.user('tokenType', result.token_type);
        });
      }
    });
})();
