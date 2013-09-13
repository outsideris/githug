/**
 * Copyright (c) 2013 JeongHoon Byun aka "Outsider", <http://blog.outsider.ne.kr/>
 * Licensed under the MIT license.
 * <http://outsider.mit-license.org/>
 */
(function() {
  'use strict';

  angular.module('githug', ['ngResource'])
    .config(['$routeProvider', function($routeProvider) {
      $routeProvider.
        when('/signin', {templateUrl: 'partials/signin.html', controller: SignInCtrl}).
        when('/timeline', {templateUrl: 'partials/timeline.html', controller: TimelineCtrl}).
        when('/repos/:userId/:repoName', {templateUrl: 'partials/repository.html', controller: RepositoryCtrl}).
        otherwise({redirectTo: '/'});
    }])
    .run(function($location, env, githubService) {
      window.scrollTo(0,1);

      var isSignIn = localStorage.getItem('token');
      if (isSignIn) {
        if (!$location.path() || $location.path() === '/signin' || $location.path() === '/') {
          $location.path('/timeline');
        }
      } else {
        $location.path('/signin');
      }

      // TODO: signin page show up when url redirected from oauth.io
      OAuth.callback('github', function(err, result) {
        if (err) { throw new Error(err); }

        env.user('token', result.access_token);
        env.user('tokenType', result.token_type);

        githubService.MyUserInfo()
          .get(function(data) {
            env.user('name', data.name);
            env.user('userid', data.login);
            env.user('avatar', data.avatar_url);
            env.user('apiurl', data.url);

            $location.path('/timeline');
          });
      });
    });

  marked.setOptions({
    gfm: true,
    tables: true,
    breaks: false,
    pedantic: false,
    sanitize: true,
    smartLists: true,
    smartypants: false,
    langPrefix: 'lang-'
  });

})();
