/**
 * Copyright (c) 2013 JeongHoon Byun aka "Outsider", <http://blog.outsider.ne.kr/>
 * Licensed under the MIT license.
 * <http://outsider.mit-license.org/>
 */
angular.module('githug')
  .filter('stripRefs', function() {
    return function(text) {
      return text.replace(/refs\/heads\//, '');
    };
  })
  .filter('timelineEvent', function() {
    return function(events) {
      return _.filter(events, function(event) {
        return event.type !== 'GistEvent' && event.type !== 'GollumEvent';
      });
    };
  })
  .filter('shortSha', function() {
    return function(sha, length) {
      var length = length || 10;
      // TODO: check why this filter is called multiple times
      return sha ? sha.substr(0, length) : sha;
    };
  })
  .filter('fromNow', function() {
    return function(date) {
      return moment(date).fromNow();
    }
  });
