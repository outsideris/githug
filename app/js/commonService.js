/**
 * service for common utility
 * Copyright (c) 2013 JeongHoon Byun aka "Outsider", <http://blog.outsider.ne.kr/>
 * Licensed under the MIT license.
 * <http://outsider.mit-license.org/>
 */
angular.module('githug')
  .factory('commonService', function() {

    return {
      parseLinkHeader: function(header) {
        if (header.length === 0) {
          throw new Error("input must not be of zero length");
        }

        // Split parts by comma
        var parts = header.split(',');
        var links = {};
        // Parse each part into a named link
        _.each(parts, function(p) {
          var section = p.split(';');
          if (section.length !== 2) {
            throw new Error("section could not be split on ';'");
          }
          var url = section[0].replace(/<(.*)>/, '$1').trim();
          var name = section[1].replace(/rel="(.*)"/, '$1').trim();
          links[name] = url;
        });

        return links;
      },
      getParameterByName: function(url, name) {
        name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
          results = regex.exec(url);
        return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
      },
      findLastPageFromHeader: function(headers) {
        var lastPageUrl = headers('link') ?
                                 this.parseLinkHeader(headers('link')).last : '?page=0',
            paramOfLastPageUrl = lastPageUrl.substr(lastPageUrl.indexOf('?')),
            lastPage = this.getParameterByName(paramOfLastPageUrl, 'page');
        return lastPage;
      }
    };
  });