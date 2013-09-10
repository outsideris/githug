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

function TimelineCtrl($scope, githubService) {
  'use strict';
  $scope.title = "Timeline";
  $scope.page = 2;

  var Timeline = githubService.Timeline();
  Timeline.query(function(timeline) {
    $scope.timeline = timeline;
  });

  $scope.pullDownAction = function(callback) {
    Timeline.query(function(timeline) {
      $scope.timeline = timeline;
      callback();
    });
  };

  $scope.loadMore = function(callback) {
    Timeline.query({page: $scope.page}, function(timeline) {
      $scope.timeline = $scope.timeline.concat(timeline);
      $scope.page += 1;
      callback();
    });
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
  };
}

function LeftSideMenuCtrl($scope, $timeout, $element, $location, env, githubService) {
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
    };

    $scope.selected = function(event) {
      $element.find('.menu').removeClass('selected');

      var tg$ = $(event.target);
      tg$.addClass('selected');
      if(tg$.attr('path')) {
        $scope.$apply(function() {
          $location.path(tg$.attr('path'));
        });
      }
    };

    $scope.beforeScroll = function(event, elem) {
      elem.find('.menu').removeClass('selected');
    };
  }, 1000);
}

function RepositoryCtrl($scope, $routeParams, githubService, commonService) {
  'use strict';
  $scope.title = "Repo / Home";

  var Repository = githubService.Repository($routeParams.userId, $routeParams.repoName),
      Star = githubService.Star($routeParams.userId, $routeParams.repoName),
      RepoWatchers = githubService.RepoWatchers($routeParams.userId, $routeParams.repoName),
      WatchRepo = githubService.WatchRepo($routeParams.userId, $routeParams.repoName);

  Repository.get(function(repo) {
    $scope.repo = repo;
  });

  Star.get(function() {
    $scope.starred = true;
  }, function() {
    $scope.starred = false;
  });

  RepoWatchers.query(function(data, getResponseHeaders) {
    var lastSubscribersUrl = commonService.parseLinkHeader(getResponseHeaders('link')).last,
        paramOfLastSubscribersUrl = lastSubscribersUrl.substr(lastSubscribersUrl.indexOf('?')),
        lastPage = commonService.getParameterByName(paramOfLastSubscribersUrl, 'page');

    if (lastPage > 1) {
      RepoWatchers.query({page: lastPage}, function(data) {
        $scope.watchers = (lastPage - 1) * 100 + data.length;
      });
    } else {
      $scope.watchers = data.length;
    }
  });


  WatchRepo.get(function(data) {
    $scope.watched = true;
    if (data.subscribed) {
      $scope.ignored = false;
    } else if (data.ignored) {
      $scope.ignored = true;
    }
  }, function() {
    $scope.watched = false;
  });

  $scope.doStar = function() {
    var send;
    if ($scope.starred) {
      send = Star.remove;
    } else {
      send = Star.put;
    }

    send(function() {
      $scope.starred = !$scope.starred;
    }, function() {
      // FIXME: handle when failed
    });
  };

  $scope.openWatchModal = function(modal) {
    $scope[modal] = !$scope[modal];
  };

  $scope.doWatch = function(type) {
    if (type === 'notWatch') {
      WatchRepo.remove(function() {
        $scope.watched = false;
      }, function() {
        // FIXME: handle when failed
      });
    } else if (type === 'watch') {
      WatchRepo.put({
        subscribed: true,
        ignored: false
      }, function() {
        $scope.watched = true;
        $scope.ignored = false;
      }, function() {
        // FIXME: handle when failed
      });
    } else if (type === 'ignore') {
      WatchRepo.put({
        subscribed: false,
        ignored: true
      }, function() {
        $scope.watched = true;
        $scope.ignored = true;
      }, function() {
        // FIXME: handle when failed
      });
    }
    $.modal.close();
  };
}
