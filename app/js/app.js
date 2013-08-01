/**
 * Copyright (c) 2013 JeongHoon Byun aka "Outsider", <http://blog.outsider.ne.kr/>
 * Licensed under the MIT license.
 * <http://outsider.mit-license.org/>
 */
(function() {
  'use strict';

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

        // TODO: signin page show up when url redirected from oauth.io
        OAuth.callback('github', function(err, result) {
          if (err) { throw new Error(err); }

          env.user('token', result.access_token);
          env.user('tokenType', result.token_type);

          github.getCurrentUserInfo(env.user('token'))
                .success(function(data) {
                  env.user('name', data.name);
                  env.user('userid', data.login);
                  env.user('avatar', data.avatar_url);
                  env.user('apiurl', data.url);

                  $location.path('/timeline');
                });
        });
      }
    });

  // filters
  githubApp
    .filter('stripRefs', function() {
      return function(text) {
        return text.replace(/refs\/heads\//, '');
      }
    })
    .filter('timelineEvent', function() {
      return function(events) {
        return _.filter(events, function(event) {
          return event.type !== 'GistEvent' && event.type !== 'GollumEvent';
        });
      }
    })
    .filter('shortSha', function() {
      return function(sha) {
        return sha.substr(0, 10);
      }
    });

  // derectives
  githubApp
    .directive('iscrollable', function($timeout, github) {
      return {
        restrict: 'A',
        link: function(scope, elem) {
          // FIXME: find out better solution for timout
          $timeout(function() {

            var myScroll,
                pullDownEl$ = $('#pullDown'),
                pullDownIcon$ = pullDownEl$.find('.pullDownIcon');

            function pullDownAction () {
              pullDownIcon$.find('span').addClass('icon-refresh-animate');

              github.getTimeline()
                .success(function(data) {
                  scope.timeline = data;
                  setTimeout(function() {
                    myScroll.refresh();
                  }, 1000)
                });
            }

            myScroll = new iScroll(elem[0], {
              useTransition: true,
              onRefresh: function () {
                if (pullDownEl$.hasClass('loading')) {
                  pullDownEl$.attr('class', '');
                  pullDownIcon$.find('span').removeClass('icon-refresh-animate');
                }
              },
              onScrollMove: function () {
                if (this.y > 50 && !pullDownEl$.hasClass('flip')) {
                  pullDownEl$.attr('class', 'loading');
                  pullDownAction();
                  this.minScrollY = 0;
                }
              }
            });
          }, 2000);
        }
      }
    });
})();
