// src/core.js
"use strict";

var
    PENDING   = -1,
    FULFILLED = 0,
    REJECTED  = 1;

function transitionTo ( promise, state, value ) {
    if ( promise.state !== PENDING ) return promise;

    promise.state = state;
    promise.value = value;

    return executeNextPromises( promise );
}

function thenCallbacks ( promise ) {
    var executed = { "first": true };

    return [function ( y ) {
        if ( executed.first ) {
            executed.first = false;
            resolvePromise( promise, y );
        }
    }, function ( reason ) {
        if ( executed.first ) {
            executed.first = false;
            transitionTo( promise, REJECTED, reason );
        }
    }, executed];
}

function resolvePromise ( promise, value ) {

    if ( promise === value ) transitionTo( promise, REJECTED, new TypeError( "Error : trying to resolve a promise with itself" ) );
    if ( promise.state !== PENDING ) return promise;

    var
        valType       = typeof value,
        then,
        resolvedAsync = false,
        cb;

    if ( (valType === "object" || valType === "function") && value !== null ) {

        cb = thenCallbacks( promise );

        try {

            then = value.then;

            if ( typeof then === "function" ) { //if then is a function, resolve as a thenable
                then.call( value, cb[0], cb[1] );
                resolvedAsync = true;
            } else {
                return transitionTo( promise, FULFILLED, value );
            }
        } catch ( err ) {//at any point if there was an error and the cb were not called (ie : cb.first = true) we reject the promise with the error catched

            if ( cb[2].first && !resolvedAsync ) { //reject only if no callbacks were called
                transitionTo( promise, REJECTED, err );
            }
        }

    }
    if ( !resolvedAsync && ((cb && cb[2].first) || !cb) ) {

        return transitionTo( promise, FULFILLED, value ); //accept if value is neither is not null
    }

    return promise;
}

function executeNextPromises ( promise ) {

    if ( promise.state === PENDING ) return promise;

    if ( promise.next ) {
        var i, l;

        for ( i = 0, l = promise.next.length; i < l; i = i + 1 ) {
            executeHandlers( promise.next[i], promise.value, promise.state );
        }
        if ( l ) promise.next = [];

    }

    return promise;
}

function executeHandlers ( future, prevVal, prevState ) {

    setTimeout( function () {
        var nextVal;
        try {
            nextVal = future.handlers[prevState].call( void(0), prevVal );


        } catch ( err ) {
            return transitionTo( future, REJECTED, err );
        }
        return resolvePromise( future, nextVal );
    }, 0 );

    return future;
}


function Thenable ( onFulfill, onRejection ) {

    //if an handler was passed, it is used, else the handler upon fulfillment will be according to the promise a+ specs 2.2.1
    var defaultCallbacks = thenCallbacks( this );

    onFulfill   = (typeof onFulfill === "function" ?
        onFulfill :
        defaultCallbacks[0]);
    onRejection = (typeof onRejection === "function" ?
        onRejection :
        defaultCallbacks[1]);

    this.handlers = [onFulfill, onRejection]; //handlers qui vont transformer la valeur (erreur ou success) selon
    this.next  = [];
    this.state = PENDING;
    this.value = void(0);
}

Thenable.prototype.then = function ( a, b ) {
    var nextPromise = new Thenable( a, b );

    if ( this.state !== PENDING ) {

        return executeHandlers( nextPromise, this.value, this.state );
    }

    this.next.push( nextPromise );
    return nextPromise;
};

Thenable.prototype.catch = function ( a ) {
    return this.then( null, a );
};

function Promise ( o ) {
    var self = this;
    Thenable.apply( self, arguments );
}

Promise.prototype = new Thenable();

Promise.prototype.resolve = function ( a ) {
    return resolvePromise( this, a );
};

Promise.prototype.reject = function ( r ) {
    return transitionTo( this, REJECTED, r );
};

module.exports = exports = {
    "Thenable": Thenable,
    "Promise": Promise
};