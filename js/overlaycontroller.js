window.EPIC = window.EPIC || {};

EPIC.OverlayController = function( overlay ){

    this.$overlay = $( overlay ).css( { opacity : 0 } );

    this.duration = 500;
    this.active  = false;
};

EPIC.OverlayController.prototype.constructor = EPIC.OverlayController;

EPIC.OverlayController.prototype.show = function(){
    
    var that = this;

    if( this.active ){

        console.log( "show" );

        this.$overlay
            .fadeTo( this.duration, 0.3 )
            .promise()
            .done( function(){
                that.$overlay.addClass( "active" );
            } );
        this.active = false;
    }
};

EPIC.OverlayController.prototype.hide = function(){
    
    var that = this;

    if( !this.active ){

        console.log( "hide" );

        this.$overlay
            .fadeTo( this.duration, 0 )
            .promise()
            .done( function(){
                that.$overlay.removeClass( "active" );
            } );
        this.active = true;
    }
};

/*GETTERS AND SETTERS*/
EPIC.OverlayController.prototype.getDuration = function(){ return this.duration; };
EPIC.OverlayController.prototype.setDuration = function( duration ){ this.duration = duration; };

