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
  .directive('sideMenuScroll', function($timeout) {
    return {
      restrict: 'C',
      link: function(scope, elem) {
        var startX, startY,
            touchedTimestamps = [],
            scrollInited = true,
            scrollEnded = true;

        elem.on('touchstart', function(event) {
          started = true;
          scrollEnded = false;

          var target = event.currentTarget;
          if (target.scrollTop === 0) {
            target.scrollTop = 1;
          } else if (target.scrollTop === target.scrollHeight - target.offsetHeight) {
            target.scrollTop -= 1;
          }

          startX = event.originalEvent.touches[0].clientX;
          startY = event.originalEvent.touches[0].clientY;
          if (scrollInited && $(event.target).hasClass('menu')) {
            scope.select(event);
          }
        });

        elem.on('touchmove', function(event) {
          touchedTimestamps.push(new Date().getTime());
          touchedTimestamps = _.rest(touchedTimestamps, touchedTimestamps.length - 3)

          var newX = event.originalEvent.changedTouches[0].clientX,
              newY = event.originalEvent.changedTouches[0].clientY,
              deltaX = Math.abs(startX - newX);
              deltaY = Math.abs(startY - newY);

          if (deltaX > deltaY) {
            event.preventDefault();
          } else if (started && typeof scope.beforeScroll === 'function') {
            // do something if some operation before scroll
            scope.beforeScroll(event, elem);
            started = false;
          }

          if (scrollInited) {
            if (Math.abs(newY - startY) > 25) { scrollInited = false; }
          }

          event.stopImmediatePropagation();
        });

        elem.on('touchend', function(event) {
          touchedTimestamps.push(new Date().getTime());

          // check whether it's momentum scroll or not using velocity of last 4 touches
          var startMomentumScroll = false;
          if (touchedTimestamps.length > 3) {
            var touchVelocity = [];
            touchVelocity.push(touchedTimestamps[1] - touchedTimestamps[0]);
            touchVelocity.push(touchedTimestamps[2] - touchedTimestamps[1]);
            touchVelocity.push(touchedTimestamps[3] - touchedTimestamps[2])
            touchedTimestamps = [];
            startMomentumScroll = _.every(touchVelocity, function(x) { return x < 25});
          }

          if (startMomentumScroll) {
            scrollInited = false;
          } else {
            // prevent click with wrong positon since browser doesn't update during momentum scroll
            if (scrollInited) {
              handler = $(event.target).attr('clickable');
              if (typeof scope[handler] === 'function') {
                scope[handler](event);
              }
            }
            scrollInited = true;
          }
          scrollEnded = true;
        });

        elem.on('scroll', function(event) {
          // scroll falg init when mementum scroll is ended without any user actions
          if (scrollEnded && !scrollInited) {
            scrollInited = true;
          }
        });
      }
    };
  })
  .directive('slideEffect', function($timeout) {
    return {
      restrict: 'A',
      link: function(scope, elem) {
        var DELAY = 30;

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
  .directive('fastClick', function() {
    return function(scope, elem, attr) {
      elem.fastClick(function (e) {
        scope.$apply(attr.fastClick);
      })
    };
  })
  .directive('eatClick', function() {
    return function(scope, element) {
      $(element).click(function(event) {
        event.preventDefault();
      });
    };
  })
  .directive('eatTouchMove', function() {
    return {
      restrict: 'A',
      link: function(scope, elem) {
        elem.on('touchmove', function(event) {
          event.preventDefault();
        });
      }
    }
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
  })
  .directive('fallbackAvatar', function() {
    return {
      restrict: 'A',
      link: function(scope, elem, attr) {
        elem.on('error', function(e) {
          $(e.target).attr('src', "https://identicons.github.com/" + attr.fallbackAvatar + ".png");
        });

      }
    }

  });
