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

  var Timeline = githubService.Timeline();
  Timeline.query(function(timeline) {
    $scope.timeline = timeline;
  });

  $scope.loadMore = function() {
    if (!$scope.scrollToEnd) {
      $scope.scrollToEnd = true;
      Timeline.query({page: $scope.page}, function(timeline) {
        $scope.timeline = $scope.timeline.concat(timeline);
        $scope.page += 1;
        // prevent multiple loadMore once
        $timeout(function() {
          $scope.scrollToEnd = false;
        }, 1000);
      });
    }
  };

  $scope.openLeftMenu = function() {
    $scope.openSideMenu = true;
  };

  $scope.closeSideMenu = function() {
    $scope.openSideMenu = false;
  };

  $scope.toggleSearchBar = function() {
    if ($scope.searchBar) {
      $scope.searchBar = '';
    } else {
      $scope.searchBar = 'activeSearchBar';
    }
  }
}

function LeftSideMenuCtrl($scope, $timeout, $element, env, githubService) {
  $timeout(function() {
    $scope.userName = env.user('name');
    $scope.avatar = env.user('avatar');

    githubService.MyRepos().query(function(repos) {
      $scope.repos = repos;
    });

    githubService.MyOrgans().query(function(orgs) {
      $scope.orgs = orgs;
    });

    $scope.$watch('repos && orgs', function(newValue, oldValue) {
      $scope.setSlide();
    });

    $scope.$watch('openSideMenu', function(newValue, oldValue) {
      if (newValue) {
        $scope.playSlide();
      } else if (!newValue && oldValue){
        $scope.resetSlide();
      }
    });

    $scope.select = function(event) {
      $element.find('.menu').removeClass('selected');
      $(event.target).addClass('selected');
    }

    $scope.selected = function(event) {
      $element.find('.menu').removeClass('selected');
      $(event.target).addClass('selected');
//      alert('selected: ' + $(event.target).text())
    }

    $scope.beforeScroll = function(event, elem) {
      elem.find('.menu').removeClass('selected');
    }
  }, 1000);
}
