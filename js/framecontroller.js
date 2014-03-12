window.EPIC = window.EPIC || {};

EPIC.FrameController = function(){

    var that = this;
    
    this.trottle = 0;
    this.limit   = 6;

    active       = false;

    this.$container = undefined;
    this.$element = undefined;
};

EPIC.FrameController.prototype.isActive = function(){
    
    return this.active;
};

EPIC.FrameController.prototype.deactivate = function(){

    this.active = false;
};

//horizontally recenters the element relative to the container
EPIC.FrameController.prototype.recenter = function(){

    if( this.$element !== undefined && this.$container !== undefined ){
        this.$element.css( { "left" : ( this.$container.width() - this.$element.width() ) / 2 } );
    }
};

EPIC.FrameController.prototype.update = function( container, el ){

    this.$container = $( container );
    this.$element   = this.$container.find( el );
    this.active     = true;
    this.recenter();
};