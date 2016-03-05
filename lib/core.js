// src/core.js
"use strict";

var
    PENDING   = -1,
    FULFILLED = 0,
    REJECTED  = 1;

/**
 *
 * @param promise {Thenable}
 * @param state
 * @param value
 * @returns {Thenable}
 */
function transitionTo ( promise, state, value ) {
    if ( promise.state !== PENDING ) return promise;

    promise.state  = state;
    promise._value = value;

    return executeNextPromises( promise );
}

/**
 *
 * @param promise {Thenable}
 * @returns {Function[]}
 */
function thenCallbacks ( promise ) {
    var executed = { "first": true };

    return [ function ( y ) {
        if ( executed.first ) {
            executed.first = false;
            resolvePromise( promise, y );
        }
    }, function ( reason ) {
        if ( executed.first ) {
            executed.first = false;
            transitionTo( promise, REJECTED, reason );
        }
    }, executed ];
}

/**
 *
 * @param promise {Thenable}
 * @param value
 * @returns {Thenable}
 */
function resolvePromise ( promise, value ) {

    if ( promise === value ) transitionTo( promise, REJECTED, new TypeError( "Error : trying to resolve a deferred with itself" ) );
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
                then.call( value, cb[ 0 ], cb[ 1 ] );
                resolvedAsync = true;
            } else {
                return transitionTo( promise, FULFILLED, value );
            }
        } catch ( err ) {//at any point if there was an error and the cb were not called (ie : cb.first = true) we reject the deferred with the error catched

            if ( cb[ 2 ].first && !resolvedAsync ) { //reject only if no callbacks were called
                transitionTo( promise, REJECTED, err );
            }
        }

    }
    if ( !resolvedAsync && ((cb && cb[ 2 ].first) || !cb) ) {

        return transitionTo( promise, FULFILLED, value ); //accept if value is neither is not null
    }

    return promise;
}

/**
 *
 * @param promise {Thenable}
 * @returns {Thenable}
 */
function executeNextPromises ( promise ) {

    if ( promise.state === PENDING ) return promise;

    if ( promise._next ) {
        var i, l;

        for ( i = 0, l = promise._next.length; i < l; i = i + 1 ) {
            executeHandlers( promise._next[ i ], promise._value, promise.state );
        }
        if ( l ) promise._next = [];

    }

    return promise;
}

/**
 *
 * @param future {Thenable}
 * @param prevVal
 * @param prevState
 * @returns {Thenable}
 */
function executeHandlers ( future, prevVal, prevState ) {

    setTimeout( function () {
        var nextVal;
        try {
            nextVal = future._handlers[ prevState ].call( void(0), prevVal );


        } catch ( err ) {
            return transitionTo( future, REJECTED, err );
        }
        return resolvePromise( future, nextVal );
    }, 0 );

    return future;
}

/**
 *
 * @param onFulfill {Function=}
 * @param onRejection {Function=}
 * @constructor
 */
function Thenable ( onFulfill, onRejection ) {

    //if an handler was passed, it is used, else the handler upon fulfillment will be according to the deferred a+ specs 2.2.1
    var defaultCallbacks = thenCallbacks( this );

    onFulfill   = (typeof onFulfill === "function" ?
        onFulfill :
        defaultCallbacks[ 0 ]);
    onRejection = (typeof onRejection === "function" ?
        onRejection :
        defaultCallbacks[ 1 ]);

    this._handlers = [ onFulfill, onRejection ]; //_handlers qui vont transformer la valeur (erreur ou success) selon
    this._next  = [];
    this.state  = PENDING;
    this._value = void(0);
}

/**
 *
 * @param onFulfill {Function=}
 * @param onRejection {Function=}
 * @returns {Thenable}
 */
Thenable.prototype.then = function ( onFulfill, onRejection ) {
    var nextPromise = new Thenable( onFulfill, onRejection );

    if ( this.state !== PENDING ) {

        return executeHandlers( nextPromise, this._value, this.state );
    }

    this._next.push( nextPromise );
    return nextPromise;
};

/**
 *
 * @param onRejection {Function}
 * @returns {Thenable}
 */
Thenable.prototype.catch = function ( onRejection ) {
    return this.then( null, onRejection );
};

/**
 *
 * @constructor
 */
function Deferred () {

    /**
     *
     * @type {Thenable}
     */
    this.promise = new Thenable();

}


/**
 *
 * @param value
 * @returns {Thenable}
 */
Deferred.prototype.resolve = function ( value ) {
    return resolvePromise( this.promise, value );
};

/**
 *
 * @param reason
 * @returns {Thenable}
 */
Deferred.prototype.reject = function ( reason ) {
    return transitionTo( this.promise, REJECTED, reason );
};

module.exports = exports = {
    "Thenable": Thenable,
    "Deferred": Deferred
};