module.exports = function(grunt){
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            options: {
                separator: '\n\n'
            },
            dist: {
                src: ['./app/shared/factory/*.js', './app/shared/directives/*.js' ],
                dest: 'mySharedLib.js'
            },
            
    
        },
        jshint: {
                beforeconcat: ['./app/shared/factory/*.js'],
                afterconcat: ['./app/shared/factory/*.js']
            }
    });

    //shortcut for loading all grunt tasks
    //require('load')
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.registerTask('default', ['concat']);
    
    
}