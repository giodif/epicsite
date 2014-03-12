module.exports = function( grunt ){
    
    grunt.initConfig({
        
        //do compass stuff
        compass : {
            options : {
                sassDir : 'scss',
                cssDir : ''
            },
            verbose : {
                options : {
                    outputStyle : 'expanded'
                }
            },
            terse : {
                options : {
                    outputStyle : 'compressed'
                }
            }
        },

        //only used for js files
        //compass compiles all of the css
        watch : {
            scripts : {
                files : [ 'js/*.js', 'js/**/*.js' ],
                tasks : [ 'concat:tobrowser' ]
            },
            styles : {
                files : [ 'scss/*.scss' ],
                tasks : [ 'compass:verbose' ]
            }
        },

        // jasmine : {
        //     src: 'js/playhead.js',
        //     options : {
        //         specs  : 'specs/**/*Spec.js',
        //         helper : 'specs/**/*Helper.js',
        //         vendor : 'js/bower/jquery/jquery.js'
        //     }
        // },


        //slaps all of the various js files together in order
        //lighter than require.js, but not as friendly
        //does not handle dependecy issues
        concat : {
            options : {
                seperator : ';',
                stripBanners : true
            },
            tobrowser : {
                src : '<%= src_js %>',
                dest : 'init.js'
            },
            tosource : {
                src : '<%= src_js %>',
                dest : 'js/main-concat.js'
            }
        },

        //moves all production files to a dist folder
        //so that it's easier to push them to the server
        copy : {
            main : {
                files : [
                    {
                        expand : true,
                        src : [
                            'init.js',
                            'index.php',
                            'main.css',
                            'inc/**'
                        ],
                        dest : 'dist/'
                    },
                ]
            },
            zip : {
                files : [
                    {
                        expand : true,
                        cwd : 'dist',
                        src : [
                            'index.php',
                            'inc/**',
                            'img/**'
                        ],
                        dest : 'zip/'
                    },
                ]
            }
        },

        //compresses jpg, png, gif and moves them to the dist folder
        imagemin : {
            movetodist : {
                options : {
                    optimizationLevel : 3
                },
                files : [
                    {
                        expand : true,
                        cwd : 'img/',
                        src : [ '**/*.{png,jpg,gif}' ],
                        dest : 'dist/img/'
                    }
                ]
            }
        },

        //just concat the js during compilation
        uglify : {
            my_target : {
                files : {
                    'init.js' : [ 'js/main-concat.js' ]
                }
            }
        },

        //compresses all files with gzip for even more minification
        compress : {
            main : {
                options : {
                    mode : 'gzip'
                },
                expand : true,
                cwd : 'dist/',
                src : [
                    'init.js',
                    'main.css'
                ],
                dest : 'zip/'
            }
        },

        //list of all js files that are to be concatonated
        //IMPORTANT: these files need to be listed in order of compilation
        //concat does not handle dependency issues
        src_js : [

            /* APP DEPENDENCIES ***/
                
                //'js/bower/modernizr/modernizr.js',
                'js/bower/jquery/jquery.js',

            /* NAMESPACING FOR THE APP, e.g. "Window.EPIC" ***/
                
                'js/base.js',
            
            /* CUSTOM JS EVENTS, e.g. "scrollStop" & "resizeStop" ***/
                
                'js/customevents.js',

            /* LOADS AND UNLOADS CONTENT, e.g. "Playhead" & "Carousel" ***/
                
                // delegates content updates to specific loaders ( polymorphic "has" )
                'js/contentmanager.js',
                
                // abstract ancestor of carouselloader and playheadloader
                'js/loader.js',

                'js/carouselloader.js',
                'js/playheadloader.js',
            
            /* CONTROLS TRANSITION BETWEEN SCENES AND EVENT SYCHING ***/
                
                // delegates content updates to specific scenemanagers ( polymorphic "has" )
                'js/scenecontroller.js',
                
                // abstract ancestor of carouselscenemanager and playheadscenemanager
                'js/scenemanager.js',

                'js/carouselscenemanager.js',
                'js/playheadscenemanager.js',

            /* VIDEO PLAYBACK CONTROLS WRAPPER FOR VIDEO ELEMENT ***/
                
                // SIMPLE IMAGE CAROUSEL
                'js/carousel.js',
                
                // VIDEO PLAYBACK CONTROLS WRAPPER FOR VIDEO ELEMENT
                // adds reverse play, frame-by-frame control, goTo(), playTo(), playFromAndTo(),
                // framerate control, playback speed, etc.
                'js/playhead.js',

            /* PRIMARY NAVIGATION WIDGET MANAGEMENT ***/
                
                'js/navcontroller.js',

            /* SIMULATES IMAGE "COVER" ***/
            /* CENTER BG RESPONSIVELY ***/
                
                'js/aspectmonitor.js',
                //'js/framecontroller.js',
            
            /* handles the background overlay to darken the image for more easily read text ***/
                
                'js/overlaycontroller.js',

            /* APP SETUP AND CONFIGURATION ***/
                
                //Everything gets wired up here
                'js/main.js'
        ]
    });

    grunt.loadNpmTasks( 'grunt-contrib-watch' );
    grunt.loadNpmTasks( 'grunt-contrib-concat' );
    grunt.loadNpmTasks( 'grunt-contrib-uglify' );
    grunt.loadNpmTasks( 'grunt-contrib-compass' );
    grunt.loadNpmTasks( 'grunt-contrib-imagemin' );
    grunt.loadNpmTasks( 'grunt-contrib-compress' );
    grunt.loadNpmTasks( 'grunt-contrib-copy' );
    grunt.loadNpmTasks( 'grunt-contrib-jasmine' );

    grunt.registerTask(
        'default',
        [
            'watch'
        ]
    );
    
    grunt.registerTask(
        'build',
        [
            'compass:terse',
            'concat:tosource',
            'uglify'
        ]
    );
    
    grunt.registerTask(
        'stage',
        [
            'build',
            'copy:main',
            'imagemin'
        ]
    );

    grunt.registerTask(
        'zip',
        [
            'stage',
            'compress',
            'copy:zip'
        ]
    );
};










