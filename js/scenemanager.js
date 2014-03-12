//Abstract Scene Manager object
window.EPIC = window.EPIC || {};

EPIC.SceneManager = function(){ this.player = undefined; };
EPIC.SceneManager.prototype.getPlayer = function(){ return this.player; };
EPIC.SceneManager.prototype.setPlayer = function( player ){ this.player = player; };
EPIC.SceneManager.prototype.goTo = function( toscene, fromscene, initialScene ){
    console.log( "Abstract method SceneManager.update( toscene, fromscene, initialScene )" );
};
EPIC.SceneManager.prototype.setPlaybackSpeed = function( speed ){
    console.log( "Abstract method SceneManager.setPlaybackSpeed( speed )" );
};