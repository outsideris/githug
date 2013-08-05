/**
 * service for environment such like token and user info
 * Copyright (c) 2013 JeongHoon Byun aka "Outsider", <http://blog.outsider.ne.kr/>
 * Licensed under the MIT license.
 * <http://outsider.mit-license.org/>
 */
githugApp.factory('env', function() {
  return {
    user: function(key, value) {
      if (value) {
        localStorage.setItem(key, value);
      } else {
        return localStorage.getItem(key);
      }
    }
  };
});