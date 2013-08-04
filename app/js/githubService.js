/**
 * service for github api
 * Copyright (c) 2013 JeongHoon Byun aka "Outsider", <http://blog.outsider.ne.kr/>
 * Licensed under the MIT license.
 * <http://outsider.mit-license.org/>
 */
githubApp.factory('githubService', function($resource, env) {

  return {
    MyUserInfo: function() {
      return $resource('https://api.github.com/user', {
        access_token: env.user('token')
      });
    },
    Timeline: function() {
      return $resource('https://api.github.com/users/:userId/received_events', {
          userId: env.user('userid'),
          access_token: env.user('token')
        }, {
          fetch: {method:'GET', isArray:true}
        });
    }
  };
});