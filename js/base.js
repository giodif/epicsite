window.EPIC = {
    $EPIC : $( this ),
    scenes : {
        "home"     : { order: 1, start :   5, stop :  61 },
        "services" : { order: 2, start :  61, stop : 127 },
        "work"     : { order: 3, start : 127, stop : 180 },
        "team"     : { order: 4, start : 180, stop : 285 },
        "contact"  : { order: 5, start : 285, stop : 330 }
    },
    getSceneByIndex : function( index ){
        
        var sceneHandle;

        $.each( this.scenes, function( key, val ){
            if( val.order === index ){ sceneHandle = key; }
        } );
        return sceneHandle;
    },
    getSceneByName : function( sceneHandle ){
    
        return this.scenes[ sceneHandle ];
    }
};