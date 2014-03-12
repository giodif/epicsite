window.EPIC = window.EPIC || {};

EPIC.Loader = function( playertype, content, wrapper ){
    
    this.loaded     = false;
    this.playertype = playertype;
    this.content    = content;
    this.wrapper    = wrapper;
    this.context    = function(){ return true; };
    this.handle     = undefined;
    this.player     = undefined;
};

EPIC.Loader.prototype.isLoaded   = function(){ return this.loaded; };
EPIC.Loader.prototype.getPlayer  = function(){ return this.player; };
EPIC.Loader.prototype.shouldLoad = function(){ throw "Abstract Object : Loader, Method : shouldLoad(), MUST BE OVERRIDDEN BY CHILDREN" ; };
EPIC.Loader.prototype.load       = function( container, wake ){ throw "Abstract Object : Loader, Method : load( container, wake ), MUST BE OVERRIDDEN BY CHILDREN"; };
EPIC.Loader.prototype.unload     = function(){ throw "Abstract Object : Loader, Method : unload(), MUST BE OVERRIDDEN BY CHILDREN"; };
EPIC.Loader.prototype.remove     = function( sleep ){

    var that = this;
    
    this.player.unload();
    
    $( this.wrapper )
        .fadeOut( 1000 )
        .promise()
        .done( function(){
            $( that.wrapper ).css( { "z-index" : "10000" } );
        } );
    sleep.call( this );
};