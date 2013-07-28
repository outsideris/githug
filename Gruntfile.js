/*jshint node:true */
module.exports = function(grunt) {
  'use strict';

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      front: {
        src: [
          'Gruntfile.js',
          'app/js/**/*.js'
        ]
      }
    },
    connect: {
      server: {
        options: {
          base: "",
          port: 9999
        }
      }
    },
    watch: {},
    karma: {
      unit: {
        configFile: 'config/karma.conf.js'
      },
      e2e: {
        configFile: 'config/karma-e2e.conf.js'
      }
    }
  });

  // These plugins provide necessary tasks.
  for (var key in grunt.file.readJSON("package.json").devDependencies) {
    if (key !== "grunt" && key.indexOf("grunt") === 0) { grunt.loadNpmTasks(key); }
  }

  // Default task.
  grunt.registerTask('default', []);
  grunt.registerTask('test', ['connect', 'karma']);
  grunt.registerTask('lint', ['jshint']);
};
