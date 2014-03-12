window.EPIC = window.EPIC || {};

EPIC.AspectMonitor = function(){

    var that = this;
    
    this.trottle = 0;
    this.limit   = 6;
    this.active  = false;

    this.outer  = undefined;
    this.inner  = undefined;

    this.$outer  = undefined;
    this.$inner  = undefined;
};

EPIC.AspectMonitor.prototype.isActive = function(){ return this.active; };
EPIC.AspectMonitor.prototype.deactivate = function(){ this.active = false; };

EPIC.AspectMonitor.prototype.calculate = function(){

    var that = this,
        visualInnerAspect,
        visualOuterAspect;

    this.$outer = $( this.outer );
    this.$inner = this.$outer.find( this.inner + ":visible" );

    visualInnerAspect = [];
    visualOuterAspect = this.$outer.width() / this.$outer.height();

    this.$inner.each( function(){
        visualInnerAspect.push( that.$inner.width() / that.$inner.height() );
    } );

    if( visualInnerAspect[ 0 ] < visualOuterAspect ){
        this.positionByTop();
    }
    else{
        this.positionByLeft();
    }
};

EPIC.AspectMonitor.prototype.positionByLeft = function(){

    this
        .$outer
        .find( this.inner )
        .removeClass( "widesize" )
        .css(
            {
                "left" : ( this.$inner.width() - this.$outer.width() ) / -2,
                "top"  : 0
            }
        );
};

EPIC.AspectMonitor.prototype.positionByTop = function(){

    this
        .$outer
        .find( this.inner )
        .addClass( "widesize" )
        .css(
            {
                "top"  : ( this.$inner.height() - this.$outer.height() ) / -2,
                "left" : 0
            }
        );
};

EPIC.AspectMonitor.prototype.update = function( outer, inner ){

    this.outer = outer;
    this.inner = inner;

    this.calculate();

    this.active = true;
};





