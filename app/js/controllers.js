/**
 * Controllers
 * Copyright (c) 2013 JeongHoon Byun aka "Outsider", <http://blog.outsider.ne.kr/>
 * Licensed under the MIT license.
 * <http://outsider.mit-license.org/>
 */
function SignInCtrl($scope) {
  'use strict';
  OAuth.initialize('UVd2jSn4mQPcjwjVBONaPoYgcfA');

  $scope.signIn = function() {
    OAuth.redirect('github', location.href);
  };
}

function TimelineCtrl($scope, $timeout, githubService) {
  'use strict';
  $scope.title = "Timeline";
  $scope.page = 2;
  $scope.scrollToEnd = false;

  // TODO: check out for cache machanism
  var Timeline = githubService.Timeline();
  Timeline.fetch(function(timeline) {
    $scope.timeline = timeline;
  });

  $scope.loadMore = function() {
    if (!$scope.scrollToEnd) {
      $scope.scrollToEnd = true;
      Timeline.fetch({page: $scope.page}, function(timeline) {
        $scope.timeline = $scope.timeline.concat(timeline);
        $scope.page += 1;
        // prevent multiple loadMore once
        $timeout(function() {
          $scope.scrollToEnd = false;
        }, 1000);
      });
    }
  }
}
