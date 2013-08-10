/**
 * Copyright (c) 2013 JeongHoon Byun aka "Outsider", <http://blog.outsider.ne.kr/>
 * Licensed under the MIT license.
 * <http://outsider.mit-license.org/>
 */
angular.module('githug')
  .directive('pullToRefresh', function($timeout, githubService) {
    return {
      restrict: 'A',
      link: function(scope, elem, attr) {
        // FIXME: find out better solution for timout
        $timeout(function() {

          var myScroll,
              pullDownEl$ = elem.find('#pullDown'),
              pullDownIcon$ = pullDownEl$.find('.pullDownIcon');

          function pullDownAction() {
            pullDownIcon$.find('span').addClass('icon-refresh-animate');

            githubService.Timeline()
              .query(function(timeline) {
                scope.timeline = timeline;
              });
          }

          scope.$watch('timeline', function(newValue, oldValue) {
            // looks weired without delay in case of fast network
            setTimeout(function() {
              myScroll.refresh();
            }, 800);
          });

          myScroll = new iScroll(elem[0], {
            useTransition: true,
            onRefresh: function () {
              if (pullDownEl$.hasClass('loading')) {
                pullDownEl$.attr('class', '');
                pullDownIcon$.find('span').removeClass('icon-refresh-animate');
              }
            },
            onScrollMove: function () {
              if (this.y > 70 && !pullDownEl$.hasClass('loading')) {
                pullDownEl$.attr('class', 'loading');
                pullDownAction();
                this.minScrollY = 0;
              } else if (this.y < this.maxScrollY && !scope.scrollToEnd) {
                scope.$apply(attr.whenScrolledToEnd);
              }
            }
          });
        }, 2000);
      }
    };
  })
  .directive('simpleScrollable', function() {
    return {
      restrict: 'A',
      link: function(scope, elem) {
        scope.scroll = new iScroll(elem[0], {
          useTransition: true,
          vScrollbar:false
        });
      }
    };
  })
  .directive('slideEffect', function($timeout) {
    return {
      restrict: 'A',
      link: function(scope, elem) {
        var DELAY = 80;

        scope.setSlide = function() {
          elem.find('li').each(function(i) {
            $(this).attr("style", "-webkit-animation-delay:" + i * DELAY + "ms;"
              + "-moz-animation-delay:" + i * DELAY + "ms;"
              + "-o-animation-delay:" + i * DELAY + "ms;"
              + "animation-delay:" + i * DELAY + "ms;");
          });
        };
        scope.playSlide = function() {
          $(elem).addClass("play");
        };
        scope.resetSlide = function() {
          $timeout(function() {
            $(elem).removeClass("play");
            $(elem).html($(elem).html());
          }, 500);
        }
      }
    };
  })
  .directive('eatClick', function() {
    return function(scope, element) {
      $(element).click(function(event) {
        event.preventDefault();
      });
    };
  })
  .directive('stats', function() {
    return {
      restrict: 'A',
      link: function() {
        var stats = new Stats();
        stats.setMode(0);

        stats.domElement.style.position = 'absolute';
        stats.domElement.style.left = '0px';
        stats.domElement.style.bottom = '0px';
        stats.domElement.style.zIndex = 9999;

        document.body.appendChild( stats.domElement );

        setInterval( function () {
          stats.update();
        }, 1000 / 60 );
      }
    }
  });