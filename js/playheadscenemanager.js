window.EPIC = window.EPIC || {};

EPIC.PlayheadSceneManager = function(){
    EPIC.SceneManager.call( this );
};

EPIC.PlayheadSceneManager.prototype = new EPIC.SceneManager();
EPIC.PlayheadSceneManager.prototype.constructor = EPIC.PlayheadSceneManager;

EPIC.PlayheadSceneManager.prototype.goTo = function( playback ){

    var st = playback.interval.start,
        sp = playback.interval.stop;

    if( st ){ this.player.goTo( st ); }

    this.player.playTo( sp );
};

EPIC.PlayheadSceneManager.prototype.setPlaybackSpeed = function( speed ){
    this.player.setPlaybackSpeed( speed );
};