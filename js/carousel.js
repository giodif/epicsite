window.EPIC = window.EPIC || {};

EPIC.Carousel = function( container, children, initialScene, animstart, animstop ){

    //hook to self to use in each loop
    var that = this;

    this.animationStart = animstart || function(){};
    this.animationStop  = animstop || function(){};

    //state
    this.initialScene = this.currentScene = initialScene || "home";

    this.duration   = 1000;
    this.$container = $( container );
    this.$frames    = ( function( $c ){

        var $list = $c.find( children ),
            iC    = { "hooks" : [] },
            len,
            i;
    
        $list.each( function(){
            var $this = $( this );
            iC[ $this.data( "hook" ) ] = $this;
            iC.hooks.push( $this.data( "hook" ) );
        } );
        //hide all frames
        for( i = 0, len = iC.hooks.length; i < len; i++  ){
            iC[ iC.hooks[ i ] ].hide();
        }
        //open the frame that matches the current scene
        iC[ that.initialScene ].fadeIn( that.getDuration(), that.animationStop() );

        return iC;
    })( this.$container );

    return this;
};

EPIC.Carousel.prototype.getCurrentScene = function(){
    return this.currentScene;
};

EPIC.Carousel.prototype.setCurrentScene = function( scene ){

    if( this.isScene( scene ) ){
        this.currentScene = scene;
        return true;
    }
    return false;
};

EPIC.Carousel.prototype.getDuration = function(){ return this.duration; };
EPIC.Carousel.prototype.setDuration = function( duration ){ this.duration = duration; };

EPIC.Carousel.prototype.isScene = function( scene ){

    var i = 0,
        len;

    for( len = this.$frames.hooks.length; i < len; i++ ){
        if( this.$frames.hooks[ i ] === scene ){ return true; }
    }
    return false;
};

EPIC.Carousel.prototype.unload = function(){

    // for( var i = 0, len = this.$frames.hooks.length; i < len; i++ ){
    //     this.$frames[ this.$frames.hooks[ i ] ].hide();
    // }
};

//goTo and playTo are the same except that
//playTo animates the transition
EPIC.Carousel.prototype.goTo = function( scene ){

    //console.log( "goTo: ", scene );

    var g = this.getCurrentScene();

    if( scene !== g && this.setCurrentScene( scene ) ){
        
        this.animationStart();
        this.$frames[ g ].hide();
        this.$frames[ this.getCurrentScene() ].show();
        this.animationStop();
        return true;
    }
    return false;
};

EPIC.Carousel.prototype.playTo = function( scene ){
    
    //console.log( "playTo: ", scene );

    var that = this,
        g    = this.getCurrentScene();

    if( scene !== g && this.setCurrentScene( scene ) ){
        
        this.$frames[ g ].fadeOut( this.getDuration() );
        
        that.animationStart();
        this
            .$frames[ scene ]
            .fadeIn( that.getDuration() )
            .promise()
            .done(
                function(){
                    that.animationStop();
                }
            );

        return true;
    }
    return false;
};
//convenience method
EPIC.Carousel.prototype.goToAndPlayTo = function( fromscene, toscene ){

    this.goTo( fromscene );
    this.playTo( toscene );
};











