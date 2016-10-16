module.exports = function(grunt){
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        
        watch: {
            js: {
                files: ['./app/shared/factory/*.js', './app/shared/directives/*.js' ],
                tasks: ['concat'],
            }
        },
        concat: {
            options: {
                separator: '\n\n'
            },
            dist: {
                src: ['./app/shared/factory/**/*.js', './app/shared/directives/*.js' ],
                dest: 'mySharedLib.js'
            },
            
    
        },
        jshint: {
                beforeconcat: ['./app/shared/factory/*.js'],
                afterconcat: ['./app/shared/factory/*.js']
            },
            //browserSync setup comes from here: https://www.browsersync.io/docs/grunt
        browserSync: {
            dev: {
                bsFiles: {
                    src: [
                        'mySharedLib.js',
                        'index.html',
                        'mainController.js'
                    ]
                },
                options: {
                    watchTask: true,
                    server: './',
                }
            }
            
        }
        
    });

    //shortcut for loading all grunt tasks
    //require('load')
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-browser-sync');
    grunt.registerTask('default', ['browserSync', 'watch']);
    
    
}