window.EPIC = window.EPIC || {};

EPIC.CarouselLoader = function( carousel, newcontext, animstart, animstop ){

    EPIC.Loader.call(
        this,
        carousel,
        "<div id='carousel' class='carousel'>" +
            "<ul>" +
                "<li data-hook='home'><img src='img/carousel/home.jpg'></li>" +
                "<li data-hook='services'><img src='img/carousel/services.jpg'></li>" +
                "<li data-hook='work'><img src='img/carousel/portfolio.jpg'></li>" +
                "<li data-hook='team'><img src='img/carousel/team.jpg'></li>" +
                "<li data-hook='contact'><img src='img/carousel/contact.jpg'></li>" +
            "</ul>" +
        "</div>",
        "#carousel"
    );
    this.handle    = "carousel";
    this.animstart = animstart || function(){};
    this.animstop  = animstop || function(){};
    this.container = undefined;
    
    if( newcontext ){
        this.context = newcontext;
    }
};

EPIC.CarouselLoader.prototype             = new EPIC.Loader();
EPIC.CarouselLoader.prototype.shouldLoad  = function(){ return this.context(); };
EPIC.CarouselLoader.prototype.load        = function( container, initFrame, wake ){
    
    var that = this,
        i    = 0,
        imgcount,
        $imglist,
        $carousel,
        allLoaded;

    this.container = container;

    //the Carousel player takes an index, not a string value for initialization of the initFrame
    if( !this.loaded ){

        this.loaded = true;
        allLoaded = function(){
            that.player = new that.playertype(
                container,
                "li",
                initFrame,
                that.animstart,
                that.animstop
            );
            that.loaded = true;
            $imglist.each( function(){ $( this ).off( "load" ); } );
            wake();
        };

        container.append( this.content );

        $carousel = container.find( "#carousel" );
        $carousel.css( { "z-index" : 20000 } );
        
        $imglist  = $carousel.find( "img" );
        imgcount  = $imglist.size();

        $imglist.each(
            function(){
                $( this ).on(
                    "load",
                    function(){
                        i++;
                        if( i >= imgcount ){
                            allLoaded();
                        }
                    }
                );
            }
        );
    }
    else{
        this.loaded = true;
        $carousel   = container.find( "#carousel" );

        $carousel.css( { "z-index" : 20000 } ).fadeIn( 1000 );
        wake();
    }
};









