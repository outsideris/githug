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

function TimelineCtrl($scope, github) {
  'use strict';
  $scope.title = "Timeline";

  github.getTimeline()
        .success(function(data) {
          $scope.timeline = data;
        });
}
