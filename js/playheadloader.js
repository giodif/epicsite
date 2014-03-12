window.EPIC = window.EPIC || {};

EPIC.PlayheadLoader = function( playhead, newcontext, animstart, animstop ){

    EPIC.Loader.call(
        this,
        playhead,
        "<video id='epictron'>" +
            "<source src='mov/EPIC4.webm' type='video/webm'>" +
            "<source src='mov/EPIC4.mp4'  type='video/mp4'>" +
        "</video>",
        "#epictron"
    );

    this.handle = "playhead";
    this.animstart = animstart || function(){};
    this.animstop = animstop || function(){};
    this.container = undefined;

    if( newcontext ){ this.context = newcontext; }
};

EPIC.PlayheadLoader.prototype            = new EPIC.Loader();
EPIC.PlayheadLoader.prototype.shouldLoad = function(){ return this.context(); };
EPIC.PlayheadLoader.prototype.load       = function( container, initFrame, wake ){

    //INITIALIZE THE PLAYHEAD AND VIDEO
    var that = this,
        iF = ( function(){
            if( initFrame ){
                return EPIC.getSceneByName( initFrame ).start;
            }
        } )(),
        $playhead;

        this.container = container;

    //Insert the video object into the dom
    if( !this.loaded ){

        container.append( this.content );
        $playhead = container.find( "#epictron" );

        $playhead.hide();

        this.player = new this.playertype(
            "epictron",
            function(){
                $playhead
                    .fadeIn( 1000 )
                    .css( { "z-index" : 20000 } );

                that.afterLoading( wake );
            },
            this.animstart,
            this.animstop
        );
    }
    else{

        $playhead = container.find( "#epictron" );

        if( iF ){ this.player.goTo( iF ); }

        $playhead
            .css( { "z-index" : 20000 } )
            .fadeIn( 1000 );

        that.afterLoading( wake );
    }
};

EPIC.PlayheadLoader.prototype.afterLoading = function( wake ){

    this.loaded = true;
    wake();
};