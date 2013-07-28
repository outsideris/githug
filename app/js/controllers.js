/**
 * Copyright (c) 2013 JeongHoon Byun aka "Outsider", <http://blog.outsider.ne.kr/>
 * Licensed under the MIT license.
 * <http://outsider.mit-license.org/>
 */
'use strict';

/* Controllers */
function SignInCtrl($scope) {
  OAuth.initialize('UVd2jSn4mQPcjwjVBONaPoYgcfA');

  $scope.signIn = function(evt) {
    OAuth.redirect('github', location.href);
  }
}

function TimelineCtrl($scope) {
  $scope.title = "Timeline";
}
