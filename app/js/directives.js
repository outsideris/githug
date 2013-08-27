/**
 * Copyright (c) 2013 JeongHoon Byun aka "Outsider", <http://blog.outsider.ne.kr/>
 * Licensed under the MIT license.
 * <http://outsider.mit-license.org/>
 */
angular.module('githug')
  .directive('pullToRefresh', function($timeout) {
    var html = '<div class="pullToRefresh">' +
                 '<div class="pullToRefreshContents">' +
                   '<span class="icon">' +
                     '<i class="arrow icon-circle-arrow-down"></i>' +
                     '<i class="spinner icon-refresh"></i>' +
                   '</span>' +
                   '<span class="pulltoRefreshMessage pull">Pull to refresh</span>' +
                   '<span class="pulltoRefreshMessage release">Release to refresh</span>' +
                   '<span class="pulltoRefreshMessage loading">Loading...</span>' +
                 '</div>' +
               '</div>';

    return {
      restrict: 'A',
      link: function(scope, elem) {
        elem.prepend(html);

        var pullToRefresh$ = elem.find('.pullToRefresh'),
            ptrHeight = pullToRefresh$.height(),
            releaseHeight = ptrHeight + 10,
            arrow$ = pullToRefresh$.find('.arrow'),
            icon$ = pullToRefresh$.find('.icon'),
            contents$ = pullToRefresh$.next(),
            contentsMarginTop = contents$.css('marginTop').replace(/px/, '') * 1;

        elem.on('touchstart', function(event) {
          var target = event.currentTarget;
          if (target.scrollTop === 0) {
            target.scrollTop = 1;
          } else if (target.scrollTop === target.scrollHeight - target.offsetHeight) {
            target.scrollTop -= 1;
          }
        })
        .on('touchmove', function(event) {
          event.stopPropagation();

          var top = elem.scrollTop();
          if (pullToRefresh$.hasClass('loading')) { return true; }

          if (top) {
            if (-top > releaseHeight) {
              if (!pullToRefresh$.hasClass('release')) {
                pullToRefresh$.removeClass('loading').addClass('release');
              }
            } else if (top > -releaseHeight) {
              if (pullToRefresh$.hasClass('release')) {
                pullToRefresh$.removeClass('release');
              }
            }
          }
        })
        .on('touchend', function() {
          if (pullToRefresh$.hasClass('release')) {
            contents$.css('marginTop', (ptrHeight + contentsMarginTop) + 'px');
            icon$.addClass('icon-refresh-animate');
            pullToRefresh$.removeClass('release').addClass('loading');
            scope.pullDownAction(function() {
              $timeout(function() {
                pullToRefresh$.removeClass('release').removeClass('loading');
                icon$.removeClass('icon-refresh-animate');
                contents$.css('marginTop', contentsMarginTop + 'px');
              }, 2000);
            })
          }
        });

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
