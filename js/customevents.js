$( function(){

    var $E    = EPIC.$EPIC,
        delay = 250,

        $scrolltimer,
        $resizetimer;

    //Creates an adhoc 'scrollStop' event,
    //That detects when user scrolling has stopped
    $( window ).on( "scroll", function(){
        
        if( $scrolltimer !== undefined ){
            clearTimeout( $scrolltimer );
        }

        $scrolltimer = setTimeout( function() {

            $E.trigger("scrollStop" );
        }, delay );
    } );

    //Creates an adhoc 'resizeStop' event,
    //That detects when user resizing has stopped
    $( window ).on( "resize", function(){
        
        if( $resizetimer !== undefined ){
            clearTimeout( $resizetimer );
        }

        $resizetimer = setTimeout( function() {

            $E.trigger( "resizeStop" );
        }, delay );
    } );
} );