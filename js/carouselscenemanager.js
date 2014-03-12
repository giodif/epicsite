window.EPIC = window.EPIC || {};

EPIC.CarouselSceneManager = function(){ EPIC.SceneManager.call( this ); };
EPIC.CarouselSceneManager.prototype = new EPIC.SceneManager();
EPIC.CarouselSceneManager.prototype.constructor = EPIC.CarouselSceneManager;

EPIC.CarouselSceneManager.prototype.goTo = function( playback ){

    var p = this.player;
    if( p ){ p.playTo( playback.handle ); }
};

EPIC.CarouselSceneManager.prototype.setPlaybackSpeed = function( speed ){

    var p = this.player;
    if( p ){ p.setDuration( speed * 1000 ); }
};