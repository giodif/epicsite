window.EPIC = window.EPIC || {};

EPIC.AppMediator = function(){

    this.publishers     = [];
    this.subscribers    = [];
    this.selfCount      = EPIC.AppMediator.countSelves();
    this.publisherhook  = "appMediatorPublisherKey" + this.selfCount;
    this.subscriberhook = "appMediatorSubscriberKey" + this.selfCount;
};

//shared
EPIC.AppMediator.selves      = 0;
EPIC.AppMediator.countSelves = function(){
    return EPIC.AppMediator.selves++;
};

//prototype methods
EPIC.AppMediator.prototype.constructor = EPIC.AppMediator;
EPIC.AppMediator.prototype.addPublisher = function( publisher ){

    if( !publisher[ this.publisherhook ] && publisher[ this.publisherhook ] !== this.selfCount  ){
        this.bindPublisher( publisher );
        this.publishers.push( publisher );
    }
};

EPIC.AppMediator.prototype.bindPublisher = function( publisher ){

    var that = this,
        publish = function( channel, pack ){
            that.publish( channel, pack );
        };

        publisher[ this.publisherhook ] = this.selfCount;
        publisher.publish = publish;
};

EPIC.AppMediator.prototype.addSubscriber = function( subscriber ){
    
    if( !subscriber[ this.subscriberhook ] && subscriber[ this.subscriberhook ] !== this.selfCount ){

        subscriber[ this.subscriberhook ] = this;
        this.bindSubscriber( subscriber );
        this.subscribers.push( { context : subscriber, channels : [] } );
    }
};

EPIC.AppMediator.prototype.bindSubscriber = function( subscriber ){
    
    var that = this,
        listenFor = function( channel, fn ){
            that.addSubscriberChannel( channel, fn, this );
        };

    subscriber[ this.subscriberhook ] = this.selfCount;
    subscriber.listenFor = listenFor;
};

EPIC.AppMediator.prototype.addSubscriberChannel = function( channel, fn, context ){

    //iterate over the subscribers
    for( var i = 0, len = this.subscribers.length; i < len; i++ ){
        //is it the same object
        if( this.subscribers[ i ].context === context ){
            this.subscribers[ i ].channels.push( { "channel" : channel, "fn" : fn } );
        }
    }
};

//notifies all subscribers when an event is broadcast and
//passes along anything from the broadcaster
EPIC.AppMediator.prototype.publish = function( channel, packet ){

    var chan;

    //iterate over subscribers
    for( var i = 0, len = this.subscribers.length; i < len; i++ ){

        //cache any channels being listend for by the subscriber
        chan = this.subscribers[ i ].channels;

        //is the subscriber listening for anything?
        if( chan.length > 0 ){

            //if yes iterate over the channels that the
            //subscriber is listening to
            for( var j = 0, slen = chan.length;  j < slen; j++ ){

                //if the channel being broadcast matches one being listened for...
                if( chan[ j ].channel === channel ){

                    //notify the listener and send them the packet
                    chan[ j ].fn.call( this.subscribers[ i ].context, packet );
                }
            }
        }
    }
};













