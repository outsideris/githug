/**
 * service for github api
 * Copyright (c) 2013 JeongHoon Byun aka "Outsider", <http://blog.outsider.ne.kr/>
 * Licensed under the MIT license.
 * <http://outsider.mit-license.org/>
 */
angular.module('githug')
  .factory('githubService', function($resource, env) {

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
          });
      },
      MyRepos: function() {
        return $resource('https://api.github.com/users/:userId/repos', {
          userId: env.user('userid'),
          access_token: env.user('token')
        });
      },
      MyOrgans: function() {
        return $resource('https://api.github.com/users/:userId/orgs', {
          userId: env.user('userid'),
          access_token: env.user('token')
        });
      },
      Repository: function(ownerId, repoName) {
        return $resource('https://api.github.com/repos/:ownerId/:repoName', {
          ownerId: ownerId,
          repoName: repoName,
          access_token: env.user('token')
        });
      },
      Star: function(ownerId, repoName) {
        return $resource('https://api.github.com/user/starred/:ownerId/:repoName', {
          ownerId: ownerId,
          repoName: repoName,
          access_token: env.user('token')
        }, {
          put: {method: 'PUT'}
        });
      },
      RepoWatchers: function(ownerId, repoName) {
        return $resource('https://api.github.com/repos/:ownerId/:repoName/subscribers', {
          ownerId: ownerId,
          repoName: repoName,
          access_token: env.user('token')
        }, {
          put: {method: 'PUT'}
        });
      },
      WatchRepo: function(ownerId, repoName) {
        return $resource('https://api.github.com/repos/:ownerId/:repoName/subscription', {
          ownerId: ownerId,
          repoName: repoName,
          access_token: env.user('token')
        }, {
          put: {method: 'PUT'}
        });
      },
      RepoLanguages: function(ownerId, repoName) {
        return $resource('https://api.github.com/repos/:ownerId/:repoName/languages', {
          ownerId: ownerId,
          repoName: repoName,
          access_token: env.user('token')
        });
      },
      RepoBranches: function(ownerId, repoName) {
        return $resource('https://api.github.com/repos/:ownerId/:repoName/branches', {
          ownerId: ownerId,
          repoName: repoName,
          access_token: env.user('token')
        });
      },
      RepoTags: function(ownerId, repoName) {
        return $resource('https://api.github.com/repos/:ownerId/:repoName/tags', {
          ownerId: ownerId,
          repoName: repoName,
          access_token: env.user('token')
        });
      },
      RepoContributors: function(ownerId, repoName) {
        return $resource('https://api.github.com/repos/:ownerId/:repoName/contributors', {
          ownerId: ownerId,
          repoName: repoName,
          access_token: env.user('token')
        });
      },
      RepoReadme: function(ownerId, repoName) {
        return $resource('https://api.github.com/repos/:ownerId/:repoName/readme', {
          ownerId: ownerId,
          repoName: repoName,
          access_token: env.user('token')
        });
      },
      RepoCommits: function(ownerId, repoName) {
        return $resource('https://api.github.com/repos/:ownerId/:repoName/commits', {
          ownerId: ownerId,
          repoName: repoName,
          access_token: env.user('token')
        });
      }
    };
  });