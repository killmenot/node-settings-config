module.exports = function (grunt) {
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    jshint: {
      files: {
        src: [
          'examples/**/*.js',
          'lib/**/*.js',
          'test/**/*.js',
          'index.js'
        ]
      },
      options: {
        jshintrc: '.jshintrc'
      }
    }
  });

  grunt.registerTask('default', ['jshint']);
};
