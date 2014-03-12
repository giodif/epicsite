/*
    Listen for page scrolling
    change to the appropriate scene based upon the currently visible 'page'
    update the currentManager so that it can relay the message to the current player

    SUBMANAGERS ( playheadscenemanager, carouselscenemanager )
        these transform generic messages into messages that the players can understand, essentially a facade
        submanagers hold no state, all the state is normalized here
*/
window.EPIC = window.EPIC || {};

EPIC.SceneController = function( scenes ){

    var that            = this;
    
    this.scenes         = scenes;
    this.managers       = {};
    this.currentManager = undefined;
    this.currentScene   = undefined;

    this.capturePages();

    return this;
};

/* GETTERS */
EPIC.SceneController.prototype.getManager = function(){ return this.currentManager; };
EPIC.SceneController.prototype.getScene   = function(){ return this.currentScene; };

EPIC.SceneController.prototype.setManager = function( handle ){

    this.currentManager = this.managers[ handle ];
};

EPIC.SceneController.prototype.getPlayer = function( player ){
    
    return this.currentManager.getPlayer();
};

EPIC.SceneController.prototype.setPlayer = function( player ){
    
    if( this.currentManager ){
        this.currentManager.setPlayer( player );
    }
};

EPIC.SceneController.prototype.capturePages = function(){

    $.each( this.scenes, function( key, val ){
        val.$handle = $( "#" + key );
    } );
};

/* ADDING MANAGEMENT */
EPIC.SceneController.prototype.addManager = function( handle, manager ){

    this.managers[ handle ] = new manager();
    this.currentManager     = this.managers[ handle ];

    return this;
};

//which scene is currently visible?
//uses jQuery
EPIC.SceneController.prototype.updateVisibleScene = function(){

    var that       = this,
        wintop     = $( window ).scrollTop(),
        winheight  = $( window ).height(),
        visible    = [],
        wiggleroom = 80,
        i          = 0,
        last,
        k, v, r;

    //calculate their positions
    $.each( this.scenes, function( key, val ){

        val.position  = val.$handle.offset().top;
        val.vtop      = val.position - wintop;
        last          = key;
    } );

    $.each( this.scenes, function( key, val ){
        
        k = key;
        v = val;

        //if the page is visible or below the fold
        if( v.vtop + v.$handle.height() - wiggleroom > 0 ){
            //if the pages is above the fold
            if( v.vtop < winheight - wiggleroom ){
                //this scene should be more or less centered on the page
                visible[ i ] = {};
                visible[ i ][ k ] = v;
                i++;
            }
        }
    } );

    if( visible && visible.length > 0 ){

        //if multiple pages count as 'visible',
        //sort them by their distance from the top of the page
        //might not be necessary, but jik
        if( visible.length > 1 ){

            visible.sort(
                function( a, b ){
                    return a.vtop - b.vtop;
                }
            );
        }

        //this is the currently visible page,
        //update the current scene
        $.each( visible[ 0 ], function( key, val ){
            that.currentScene = {
                "handle" : key,
                "scene"  : val
            };
        } );
    }else{

        //nothing is visible assumes that the site
        //is scrolled to the bottom of the page
        this.currentScene = {
            "handle" : last,
            "scene"  : this.scenes[ last ]
        };
    }
};

/* UPDATE THE ACTIVE MANAGER AND PLAYER */
//If start scene is not undefined,
//then the scene will jump to start scene and play to scene
EPIC.SceneController.prototype.goTo = function( playback ){

    if( this.currentManager ){
        this.currentManager.goTo( playback );
    }
};

EPIC.SceneController.prototype.setPlaybackSpeed = function( speed ){

    if( this.currentManager ){
        this.currentManager.setPlaybackSpeed( speed );
    }
};







