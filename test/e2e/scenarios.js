'use strict';

describe('Githug App', function() {

  describe('Default Contoller', function() {
    it('index.html에 접근하면 index.html#/install로 리다이렉트 된다', function() {
      browser().navigateTo('../../app/index.html');
      expect(browser().location().url()).toBe('/install');
    });
  });
});
