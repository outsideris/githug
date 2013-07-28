/**
 * service for github api
 * Copyright (c) 2013 JeongHoon Byun aka "Outsider", <http://blog.outsider.ne.kr/>
 * Licensed under the MIT license.
 * <http://outsider.mit-license.org/>
 */

githubApp.factory('github', function($http, env) {
  var attachToken = function(url) {
    var token = env.user('token'),
        tokenParam = '';

    if (token) {
      tokenParam = '?access_token=' + token
    }
    return url + tokenParam;
  };

  return {
    getCurrentUserInfo: function(token) {
      var url = attachToken('https://api.github.com/user');
      return $http({method: 'GET', url: url})
    }
  }
});