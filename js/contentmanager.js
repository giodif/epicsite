/*
Switches between differnet content types
    - $container is the dom element that holds the switching content
    - This object manages the content loaders, the loaders control the players.
    - This object asks the loaders if they should load and loads the first that says yes
*/
window.EPIC = window.EPIC || {};

EPIC.ContentManager = function( container ){

    this.content        = {};
    this.wakeCB         = {};
    this.sleepCB        = {};
    this.handles        = [];
    this.$container     = $( container );

    this.currentHandle  = undefined;
    this.nextHandle     = undefined;

    return this;
};

EPIC.ContentManager.prototype.getPlayer            = function(){ return this.content[ this.nextHandle ].player; };
EPIC.ContentManager.prototype.getPlayerTypeHandle  = function(){ return this.currentHandle; };
EPIC.ContentManager.prototype.setPlayerTypeHandle  = function( handle ){ this.currentHandle = handle; };

EPIC.ContentManager.prototype.getNextPlayerType    = function(){ return this.nextHandle; };
EPIC.ContentManager.prototype.setNextPlayerType    = function( handle ){ this.nextHandle = handle; };
EPIC.ContentManager.prototype.addContent           = function( contentOBJ, wake, sleep, playbackstart, playbackstop ){

    this.content[ contentOBJ.handle ] = contentOBJ;
    this.sleepCB[ contentOBJ.handle ] = sleep || function(){};
    this.wakeCB[  contentOBJ.handle ] = wake  || function(){};

    this.handles.push( contentOBJ.handle );

    return this;
};
//Should Content Be loaded? If so, go ahead
EPIC.ContentManager.prototype.update = function(){

    var currenthandle = this.getPlayerTypeHandle(),
        handle,
        content;

    for( var i = 0, len = this.handles.length; i < len; i++ ){

        handle  = this.handles[ i ];
        content = this.content[ handle ];

        if( currenthandle !== handle && content.shouldLoad() ){

            //Keep reference to the player handle
            this.setNextPlayerType( handle );
            return true;
        }
    }

    return false;
};

EPIC.ContentManager.prototype.load = function( initFrame ){

    var content = this.content[ this.getNextPlayerType() ];

    if( content.shouldLoad() ){

        //Ask the loader to unload and clean up the current player
        if( this.getPlayerTypeHandle() ){ this.unload( this.getPlayerTypeHandle() ); }

        //Tell the new loader to load the appropriate content
        content.load( this.$container,  initFrame , this.wakeCB[ this.getNextPlayerType() ] );
        this.setPlayerTypeHandle( this.getNextPlayerType() );
        return true;
    }
    return false;
};

EPIC.ContentManager.prototype.currentManager = function(){

    return this.content[ this.getNextPlayerType() ];
};

EPIC.ContentManager.prototype.unload = function( handle ){
    
    if( this.content[ handle ] ){

        this.content[ handle ].remove( this.sleepCB[ handle ] );
        this.setPlayerTypeHandle( undefined );

        return true;
    }
    return false;
};




