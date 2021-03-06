/**
 * Controllers
 * Copyright (c) 2013 JeongHoon Byun aka "Outsider", <http://blog.outsider.ne.kr/>
 * Licensed under the MIT license.
 * <http://outsider.mit-license.org/>
 */
function MainCtrl($scope) {
  $scope.openLeftMenu = function() {
    $scope.LeftMenuOpened = true;
  };

  $scope.closeSideMenu = function() {
    $scope.LeftMenuOpened = false;
    $scope.RightMenuOpened = false;
  };

  $scope.openRightMenu = function() {
    $scope.RightMenuOpened = true;
  };
}

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

  $scope.toggleSearchBar = function() {
    if ($scope.searchBar) {
      $scope.searchBar = '';
    } else {
      $scope.searchBar = 'activeSearchBar';
    }
  };
}

function SideMenuCtrl($scope, $location, $timeout) {
  $scope.select = function(event) {
    var tg$ = $(event.target);
    tg$.closest('.sidemenu').find('.menu').removeClass('selected');
    tg$.addClass('selected');
  };

  $scope.selected = function(event) {
    event.stopPropagation();

    var tg$ = $(event.target);
    tg$.closest('.sidemenu').find('.menu').removeClass('selected');

    tg$.addClass('selected');
    var newPath = tg$.attr('path');
    if (newPath) {
      $scope.$apply(function() {
        // prevent wrong click!!
        // since click event take 0.3s, click event occured after closeSideMenu
        // without 300ms delay.
        $timeout(function() {
          $scope.closeSideMenu();
          if ($location.path() !== newPath) {
            $timeout(function() {
              $location.path(newPath);
            }, 300);
          }
        }, 300);
      });
    }
  };

  $scope.beforeScroll = function(event, elem) {
    elem.find('.menu').removeClass('selected');
  };
}

function LeftSideMenuCtrl($scope, $timeout, $location, env, githubService) {
  angular.extend(this, new SideMenuCtrl($scope, $location, $timeout));

  $timeout(function() {
    $scope.userName = env.user('name');
    $scope.avatar = env.user('avatar');

    githubService.MyRepos().query(function(repos) {
      $scope.repos = repos;
    });

    githubService.MyOrgans().query(function(orgs) {
      $scope.orgs = orgs;
    });

    $scope.$watch('repos && orgs', function() {
      $scope.setSlide();
    });

    $scope.$watch('LeftMenuOpened', function(newValue, oldValue) {
      if (newValue) {
        $scope.playSlide();
      } else if (!newValue && oldValue){
        $scope.resetSlide();
      }
    });
  }, 1000);
}

function RightSideMenuCtrl($scope, $timeout, $location) {
  angular.extend(this, new SideMenuCtrl($scope, $location, $timeout));

  $timeout(function() {
    $scope.$watch('branches', function(newValue, oldValue) {
      $scope.setSlide();
    });

    $scope.$watch('RightMenuOpened ', function(newValue, oldValue) {
      if (newValue) {
        $scope.playSlide();
      } else if (!newValue && oldValue){
        $scope.resetSlide();
      }
    });
  }, 1000);
}

function RepositoryCtrl($scope, $routeParams, githubService, commonService) {
  'use strict';
  $scope.title = "Repo / Home";
  $scope.homePath = "/repos/" + $routeParams.userId + "/" + $routeParams.repoName;

  var Repository = githubService.Repository($routeParams.userId, $routeParams.repoName),
      Star = githubService.Star($routeParams.userId, $routeParams.repoName),
      RepoWatchers = githubService.RepoWatchers($routeParams.userId, $routeParams.repoName),
      WatchRepo = githubService.WatchRepo($routeParams.userId, $routeParams.repoName),
      RepoLanguages = githubService.RepoLanguages($routeParams.userId, $routeParams.repoName),
      RepoBranches = githubService.RepoBranches($routeParams.userId, $routeParams.repoName),
      RepoTags = githubService.RepoTags($routeParams.userId, $routeParams.repoName),
      RepoContributors = githubService.RepoContributors($routeParams.userId, $routeParams.repoName),
      RepoReadme = githubService.RepoReadme($routeParams.userId, $routeParams.repoName),
      RepoCommits = githubService.RepoCommits($routeParams.userId, $routeParams.repoName);

  $scope.myWatchCount = 0;

  Repository.get(function(repo) {
    $scope.repo = repo;
  });

  Star.get(function() {
    $scope.starred = true;
  }, function() {
    $scope.starred = false;
  });

  // watch count
  RepoWatchers.query(function(data, getResponseHeaders) {
    var lastPage = commonService.findLastPageFromHeader(getResponseHeaders);

    if (lastPage > 1) {
      RepoWatchers.query({page: lastPage}, function(data) {
        $scope.watchers = (lastPage - 1) * 100 + data.length;
      });
    } else {
      $scope.watchers = data.length;
    }
  });

  // check if user watch this repository
  WatchRepo.get(function(data) {
    $scope.watched = true;
    if (data.subscribed) {
      $scope.ignored = false;
    } else if (data.ignored) {
      $scope.ignored = true;
    }
    $scope.watchers = $scope.watchers - 1;
    $scope.myWatchCount = 1;
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
        $scope.myWatchCount = 0;
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
        $scope.myWatchCount = 1;
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
        $scope.myWatchCount = 1;
      }, function() {
        // FIXME: handle when failed
      });
    }
    $.modal.close();
  };

  // languages used
  var colors = d3.scale.category10().range();
  RepoLanguages.get(function(data) {
    var total = 0,
        languages = [];

    var getOther = function(languages) {
      var others = languages.filter(function(l) {
        return l.name === 'Other';
      });

      if (others.length > 0) { return others[0]; }
      else { return null; }
    };

    Object.keys(data).forEach(function(key) {
      total += data[key];
    });
    Object.keys(data).forEach(function(key) {
      var lang = {},
          percentage = Math.round(data[key] / total * 1000) / 10;

      if (percentage > 1.0) {
        lang.name = key;
        lang.percentage = percentage;
        languages.push(lang);
      } else {
        var other = getOther(languages);
        if (other) {
          other.percentage += percentage;
        } else {
          other = {
            name: 'Other',
            percentage: percentage
          };
          languages.push(other);
        }
      }
    });
    languages.sort(function(a, b) {return b.percentage - a.percentage;});
    languages.forEach(function(l, i) {
      l.style = {
        backgroundColor: colors[i],
        width: 100 / languages.length + '%'
      };
    });
    $scope.languages = languages;
  });

  // branches
  RepoBranches.query(function(data) {
    $scope.branchCount = data.length;
    $scope.branches = data;
  });

  // tags
  RepoTags.query(function(data) {
    $scope.tagCount = data.length;
  });

  // contributors
  RepoContributors.query(function(data) {
    $scope.contributorCount = data.length;
  });

  // get readme
  RepoReadme.get(function(data) {
    var content = [],
        splittedContent = data.content.split('\n');

    splittedContent.forEach(function(line) {
      content.push(Base64.decode(line));
    });

    $scope.readme = marked(content.join(''));
  });

  // get commits
  RepoCommits.query(function(data) {
    if (data.length) {
      $scope.lastestCommit = {
        msg: data[0].commit.message,
        sha: data[0].sha,
        author: data[0].committer,
        created_at: data[0].commit.committer.date
      };
    }
  });
}
