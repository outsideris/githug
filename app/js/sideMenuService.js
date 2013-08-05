/**
 * service for handling side menu
 * Copyright (c) 2013 JeongHoon Byun aka "Outsider", <http://blog.outsider.ne.kr/>
 * Licensed under the MIT license.
 * <http://outsider.mit-license.org/>
 */
githugApp.factory('sideMenuService', function() {

  return {
    leftOpened: false,
    toggleLeft: function() {
      if (this.leftOpened) {
        this.leftOpened = false;
        return '';
      } else {
        this.leftOpened = true;
        return 'sidemenu-left-open';
      }
    }
  };
});