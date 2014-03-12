/*
    TODO:
    
    1. Fix video reload rending bug
    2. Cache video and carousel DOM elements so rewrites don't cause a server request
    3. Lazy load carousel as needed. i.e. only load the video if the screen size is large enough to accomodate it
    4. Fire overlay fadein and fadeout with css, not js.
    5. Add content to HTML sections:
        a. Team Epic
        b. Services
        c. Contact Us
        d. Our Work

    6. Style content to match PSD
    7. Style 'page' titles
    8. Upload to github
    9. Share github link with Nic
*/

$( function(){

    //Cache the necessary objects for ease of access
        //handles collapsing and expanding of the site's primary navigation
        //has nothing to do with the background
    var NavController = EPIC.NavController,

        //keeps the visual background framed within the viewport
        //responds to a set of events
        //independent of the content manager or the scene controller
        AspectMonitor = EPIC.AspectMonitor,

        //hides and shows the background overlay to make text easier to read
        OverlayController = EPIC.OverlayController,

        //controls the content loaders
        //messages loaders to let them know when to load and unload content
        ContentManager = EPIC.ContentManager,

        //normalizes the api for all scene managers and then passes to each scene manager
        //a message that it will understand
        SceneController = EPIC.SceneController,

        //scene managers pass messages to the players to change frames of initialize playback,
        //don't interact directly with these, instead message scene cobntroller and it will know which
        //scene manager to address
        PlayheadSceneManager = EPIC.PlayheadSceneManager,
        CarouselSceneManager = EPIC.CarouselSceneManager,
        
        //these load the players (video player and carousel) and handle messaging to the players for events
        PlayheadLoader = EPIC.PlayheadLoader,
        CarouselLoader = EPIC.CarouselLoader,

        //players, the app doesn't interact directly with these
        Playhead = EPIC.Playhead,
        Carousel = EPIC.Carousel;

    /* WIRE EVERYTHING UP TOGETHER */
    EPIC.APP = function(){

        this.$E = window.$E = EPIC.$EPIC;
        this.init = false;
        //"home", "work", etc.
        this.currentscene = undefined;
        /* STAND ALONE OBJECTS */
        //Respont to the same events as the scene controller and the content manager
        this.nav = new NavController( ".navicon", ".sitenavlist" );
        //uses javascript to simulate "cover" background media
        this.aspect = new AspectMonitor();
        //this.overlay = new OverlayController( ".paused" );
        /* SCENE MANAGEMENT */
        //Add components to the scene manager to transition between scenes for both background types
        //The scene controller handles loading and unloading of scene managers
        this.scenecontroller = new SceneController( EPIC.scenes )
            .addManager(
                //Manager handle
                "carousel",
                //Manager type constructor
                CarouselSceneManager
            );
        //Create the content manager
        //Add loaders to the content manager to handle loading and unloading the different background types
        //The content manager handles messaging the loaders
        //Loaders handle loading and unloading content (essentially mini factories)
        this.contentmanager = new ContentManager( "#epictron_container" );
        //Load the video playhead if the browser supports it.
        if( this.supportsVideo() ){

            this.scenecontroller.addManager(
                //Manager handle
                "playhead",
                //Manager type constructor
                PlayheadSceneManager
            );

            //Add both managers and their constraints so that they don't every play simultaneously
            this.contentmanager
                .addContent(
                    //Newly instatiated PlayheadLoader object with the Playhead constructor
                    //add new context for when the player should be active
                    new PlayheadLoader(
                            //player type
                            Playhead,
                            //context
                            function(){ return $( window ).width() >= 800; },
                            //playbackstart callback
                            function(){ $E.trigger( "animstart" ); },
                            //playbackstop callback
                            function(){ $E.trigger( "animstop" ); }
                    ),
                    //wake callback
                    function(){ $E.trigger( "playheadloaded" ); },
                    //sleep callback
                    function(){ /*$E.trigger( "playheadunloaded" );*/ }

                ).addContent(
                    //Newly instatiated CarouselLoader object with the Carousel constructor
                    //add new context for when the player should be active
                    new CarouselLoader(
                            //player type
                            Carousel,
                            //context
                            function(){ return $( window ).width() < 800; },
                            //playbackstart callback
                            function(){ $E.trigger( "animstart" ); },
                            //playbackstop callback
                            function(){ $E.trigger( "animstop" ); }
                    ),
                    //wake callback
                    function(){ $E.trigger( "carouselloaded" ); },
                    //sleep callback
                    function(){ /*$E.trigger( "carouselunloaded" );*/ }
                );
        }
        else{
            //Always use the carouselLoader if the browser doesn't support video
            this.contentmanager
                .addContent(
                    //Newly instatiated CarouselLoader object with the Carousel constructor
                    new CarouselLoader(
                            //player type
                            Carousel,
                            //context
                            function(){ return true; },
                            //playbackstart callback
                            function(){ $E.trigger( "animstart" ); },
                            //playbackstop callback
                            function(){ $E.trigger( "animstop" ); }
                ),
                //wake callback
                function(){ $E.trigger( "carouselloaded" ); },
                //sleep callback
                function(){ /*$E.trigger( "carouselunloaded" );*/ }
            );
        }
        //Attach all of the events necessary to keep everything in synch
        this.bindEvents();
        this.updateSceneData();
        this.updateContentData();
    };

    EPIC.APP.prototype.bindEvents = function(){

        var that = this;

        this.$E
            .on( "animstart", function( e ){ /*that.overlay.hide();*/ } )
            .on( "animstop",  function( e ){ /*that.overlay.show();*/ } );
        //Every time scrolling and/or resizing stops
        //Determine which scene should be displayed
        this.$E
            .on( "resize", function( e ){ that.aspect.calculate(); } )
            .on( "resizeStop", function( e ){ that.updateContentData(); } )
            .on( "carouselloaded", function( e ){ that.aspect.update( "#epictron_container", "img" ); } )
            .on(
                "scrollStop carouselloaded",
                function( e ){
                    that.updateSceneData();
                    that.scenecontroller.setManager( that.contentmanager.getNextPlayerType() );
                    that.scenecontroller.setPlayer( that.contentmanager.getPlayer() );
                    that.scenecontroller.goTo( that.currentScenePlayback() );
                }
            );
        //Add the video playhead if the browser supports it,
        //Otherwise just stick to the carousel
        if( this.supportsVideo() ){
            //Every time scrolling and/or resizing stops
            //Determine which scene should be displayed
            this.$E
                .on(
                    "playheadloaded",
                    function( e ){
                        that.updateSceneData();
                        that.aspect.update( "#epictron_container", "video" );
                        that.scenecontroller.setManager( that.contentmanager.getNextPlayerType() );
                        that.scenecontroller.setPlayer( that.contentmanager.getPlayer() );
                        that.scenecontroller.goTo( that.currentScenePlayback() );
                    }
                );
        }
    };

    EPIC.APP.prototype.updateSceneData = function(){
        //which scene is currently visible? "home", "work", etc.
        this.scenecontroller.updateVisibleScene();
        //retrieve the scene object { handle: "home", scene: Obj }
        this.currentscene = this.scenecontroller.getScene();
    };

    EPIC.APP.prototype.currentScenePlayback = function(){
        //get the start and stop scene data
        return {
            handle   : this.currentscene.handle,
            interval : this.getSceneLoadData( this.currentscene.scene)
        };
    };

    EPIC.APP.prototype.updateContentData = function(){

        //checks to see if either the playhead or carousel need to be loaded or unloaded
        if( this.contentmanager.update() ){

            //load the content
            this.contentmanager.load( this.currentscene.handle );
        }
    };

    //returns the currentscene.scene.stop and the scene just before the currentscene.scene.start
    EPIC.APP.prototype.getSceneLoadData = function( scene ){

        var that = this,
            starter = ( function(){

                if( !that.contentmanager.currentManager().loaded ){
                    return scene.order > 1 ? ( EPIC.getSceneByName( EPIC.getSceneByIndex( scene.order - 1 ) ) ).start : scene.start;
                }

                return undefined;
            } )();

        return{
            start : starter,
            stop  : scene.stop
        };
    };

    //Does the browser support the HTML5 video tag?
    EPIC.APP.prototype.supportsVideo = function(){ return !!document.createElement( 'video' ).canPlayType; };

    //Create EPIC VISUALS
    var app = new EPIC.APP();
} );







