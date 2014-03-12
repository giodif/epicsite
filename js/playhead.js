//Grab video when it's loaded
/*Interface functions

    *** PLAYBACK ***
    play() - Starts playback
    stop() - Stops playback and resets playhead to beginning
    pause() - Stops playback but doesn't reset playhead to beginning
    rewind() - Doesn't stop playback but returns playhead to beginning
    reverse() - Reverses playback direction e.g. forward playback to reverse playback, vice-versa
    goTo( to ) - Move the playhead to a particular frame, but don't play
    playTo( to ) - play from the current playhead position to a new playhead position ( frame )
    playFrom( from ) - Move the playhead to a particular frame and play to the hardStop
    playFromAndTo( from, to ) - Move the playhead to frame ( from ) and play to the destination frame ( to )
    
    *** SETTERS ***
    framerate( rate ) - Changes playback framerate, but not playback speed. default framerate is 24.
    reverse() - Reverse playback direction.
    playbackSpeed( speed ) - Changes playback speed, default is 1. 0.5 will halve playback speed; 2 will double playback speed.
    loop( loo ) - Set whether the video should continue looping or not, default 
*/

/*** PUBLIC INTERFACE OBJECT ********************/
/************************************************/
/*** SETUP **************************************/
/************************************************/
window.EPIC = window.EPIC || {};

EPIC.Playhead = function( id, func, playbackstart, playbackstop ){

    var that = this,
        fx   = func || function(){};

    //Create instance of private vars
    this.bg              = document.getElementById( id );
    this.timerBody       = undefined;
    this.canPlay         = true;
    this.isPlaying       = false;
    this.isReverse       = false;
    this.shouldLoop      = false;
    this.baserate        = 24;
    this.timeroot        = 1000;

    //playhead timing
    this.frameCount      = 0;
    this.hardStop        = 1;

    this.currentrate     = this.baserate;
    this.currenttimeroot = this.timeroot;
    this.delta           = this.timeroot/this.baserate; //default 41.666667

    this.playbackStart   = playbackstart || function(){};
    this.playbackStop    = playbackstop  || function(){};

    //if request to play is issued before the player is loaded
    this.ready           = false;
    this.readytype       = {};

    this.readydeferred   = function(){

        var that = this,
            handle,
            props;

        if( this.playheadready ){

            handle = this.readytype.handle;
            props  = this.readytype.props;

            switch( handle ){
                case "goTo":

                    that.goTo( props[ 0 ] );
                    break;

                case "playTo":

                    that.playTo( props[ 0 ] );
                    break;

                case "playFrom":

                    that.playFrom( props[ 0 ] );
                    break;

                case "playFromAndTo":

                    that.playFromAndTo( props[ 0 ], props[ 1 ] );
                    break;
            }

            this.readytype = undefined;
        }
    };

    //This mess is a workaround for a bug in the HTML5 Spec that causes the
    //canplaythgough event to fire over and over again.
    var canplay = function(){

        setTimeout( function(){

            that.ready = true;
            
            if( this.readytype ){
                that.readydeferred();
            }

            that.setHardStop();
            that.goTo( 1 );
            fx.call( that );
        }, 500 );

        that.bg.removeEventListener( "canplaythrough", canplay );
    };

    this.bg.addEventListener( "canplaythrough", canplay );
};

/*** INTERNAL FUNCTIONS *************************/
/************************************************/
//these should basically be considered private
EPIC.Playhead.prototype.timeToFrame = function( time ){ return Math.floor( time * this.baserate ); };
EPIC.Playhead.prototype.frameToTime = function( frame ){ return frame / this.baserate; };
EPIC.Playhead.prototype.tick = function(){

    //reverse playback?
    if( !this.isReverse ){
        this.tickForward();
    }
    else{
        this.tickBackward();
    }
};
EPIC.Playhead.prototype.tickForward = function(){

    var ddt;

    this.frameCount += 1;
    ddt = this.dt();

    if( this.bg.currentTime ){ this.bg.currentTime = ddt; }

    if( ddt >= this.hardStop ){
        if( this.hardStop < this.bg.duration ){
            this.pause();
        }
        else{
            this.stop();
            this.setHardStop();
        }
    }
};
EPIC.Playhead.prototype.tickBackward = function(){

    var ddt;

    this.frameCount -= 1;
    ddt = this.dt();
    this.bg.currentTime = ddt;

    if( ddt <= this.hardStop ){
        if( this.hardStop > 0 ){
            this.pause();
        }
        else{
            this.stop();
            this.setHardStop();
        }
    }
};
EPIC.Playhead.prototype.dt = function(){

    return ( this.frameCount * this.delta ) / this.currenttimeroot;
};
EPIC.Playhead.prototype.setDelta = function(){

    this.delta = this.currenttimeroot / this.currentrate;
};
EPIC.Playhead.prototype.setHardStop = function( hs ){

    if( hs === 0 ){
        this.hardStop = 0;
    }
    else if( hs === undefined ){

        if( !this.isReverse ){
            this.hardStop = this.bg.duration;
        }
        else{
            this.hardStop = 0;
        }
    }
    else{
        this.hardStop = this.frameToTime( hs );
    }
};
EPIC.Playhead.prototype.unload = function(){

    /* STOP ANY TIMERS AND UNLOAD ANY ACTIVITIES */
    if( this.isPlaying ){ this.pause(); }
};

/*** PLAYHEAD CONTROL ***************************/
/************************************************/
EPIC.Playhead.prototype.play = function(){

    var that = this;

    if( !this.canPlay ){
        this.isPlaying = false;
        return false;
    }

    this.canPlay   = false;
    this.isPlaying = true;

    this.timerBody = setInterval(
        function(){
            that.tick();
        },
        this.delta
    );

    this.playbackStart();

    return true;
};
EPIC.Playhead.prototype.pause = function(){

    this.isPlaying = false;
    this.canPlay   = true;
    clearTimeout( this.timerBody );

    this.playbackStop();

    return this.isPlaying;
};
EPIC.Playhead.prototype.rewind = function(){

    this.frameCount = 0;
    this.bg.currentTime = 0;
};
EPIC.Playhead.prototype.stop = function(){

    this.pause();
    this.rewind();
    this.setHardStop();

    this.playbackStop();
};
//jump to certain currentTime
EPIC.Playhead.prototype.goTo = function( to ){

    //console.log( this.ready, "goTo", to );

    if( this.hardStop === this.frameToTime( to ) ){
        console.log( "already going to that frame" );
        return false;
    }

    if( !this.ready ){

        this.readytype = { handle : "goTo", props : [ to ] };
        return false;
    }

    this.frameCount = to;
    this.bg.currentTime = this.dt();
    this.pause();

    return true;
};
//play from the current playhead position to a new playhead location
EPIC.Playhead.prototype.playTo = function( to ){

    //console.log( this.ready, "playTo", to  );

    if( !this.ready ){

        this.readytype = { handle : "playTo", props : [ to ] };
        return false;
    }

    //set the playhead direction
    if( !this.isReverse && to < this.frameCount || this.isReverse && to > this.frameCount ){
        this.reverse();
    }

    this.setHardStop( to );
    this.play();

    return true;
};
//jump to certain currentTime
EPIC.Playhead.prototype.playFrom = function( from ){

    if( !this.ready ){

        this.readytype = { handle : "playFrom", props : [ from ] };
        return false;
    }
    
    this.frameCount = from;
    this.bg.currentTime = this.dt();
    this.play();

    return true;
};
//jump playhead to a new position and play to the next position
EPIC.Playhead.prototype.playFromAndTo = function( from, to ){

    if( !this.ready ){

        this.readytype = { handle : "playFromAndTo", props : [ from, to ] };
        return false;
    }

    if( to === undefined ){
        this.playFrom( from );
        return false;
    }

    //set the playhead direction
    if( !this.isReverse && to < from ||
        this.isReverse && to > from
    ){
        this.reverse();
    }

    this.setHardStop( to );
    this.playFrom( from );

    return true;
};


/*** SETTERS ************************************/
/************************************************/
//pass nothing or "reset" to return framerate to standard 24 per second
EPIC.Playhead.prototype.frameRate = function( rate ){

    this.currentrate = rate === undefined || rate === "reset" ? this.baserate : rate;
    
    if( rate === undefined || rate === "reset" ){
        this.currenttimeroot = this.timeroot;
    }
    this.setDelta();
};
//pass nothing or "reset" to return framerate to standard 24 per second
EPIC.Playhead.prototype.setPlaybackSpeed = function( speed ){

    this.currenttimeroot = speed === undefined || speed === "reset" ? this.timeroot : ( this.timeroot / speed );
    this.setDelta();
};
//reverse the playback direction
EPIC.Playhead.prototype.reverse = function(){
    
    this.isReverse = !this.isReverse;
    this.setHardStop( !this.isReverse ? this.bg.duration : 0 );
};
//should the video loop as it plays back, default true;
EPIC.Playhead.prototype.loop = function( loo ){

    this.shouldLoop = loo || true;
};


/*** GETTERS ************************************/
/************************************************/
EPIC.Playhead.prototype.getPlaybackSpeed  = function(){ return this.currenttimeroot; };
EPIC.Playhead.prototype.getCurrentFrame   = function(){ return this.frameCount; };
EPIC.Playhead.prototype.getFrameRate      = function(){ return this.currentrate; };
EPIC.Playhead.prototype.getDelta          = function(){ return this.delta; };










