//Nav control
window.EPIC = window.EPIC || {};

EPIC.NavController = function( trigger, target, mobileMax ){

    var that = this;

    this.$trigger  = $( trigger );
    this.$target   = $( target );

    this.mobileMax = mobileMax || 800;
    this.isToggle  = false;
    this.isVisible = false;

    this.$target.hide();

    //set up resize event to handle passive content updates
    $( window ).on( "resize.navcontroller", function(){
        that.shouldCreateToggle();
    } );

    this.shouldCreateToggle();
};

EPIC.NavController.prototype.isMobile = function(){
    return $( window ).width() <= this.mobileMax;
};

EPIC.NavController.prototype.shouldCreateToggle = function(){

    this.$target.hide();

    if( !this.isMobile() && !this.isToggle ){
        this.onToggle();
    }
    else if( this.isMobile() && this.isToggle ){
        this.offToggle();
    }
};

EPIC.NavController.prototype.onToggle = function(){

    var that = this;

    this.isToggle = true;
    this.isVisible = false;

    this.$trigger.on( "click", function(){

        if( that.isVisible ){
            that.$target.hide();
            that.isVisible = false;
        }
        else{
            that.$target.show();
            that.isVisible = true;
        }
        return false;
    } );
};

EPIC.NavController.prototype.offToggle = function(){

    this.isToggle = false;
    this.$trigger.off( "click" );
};
