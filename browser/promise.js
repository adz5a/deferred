(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// src/ajaxWrap.js
"use strict";
var core = require( "./core.js" );

module.exports = exports = function ( $ ) {
    //$ is the jquery instance
    if ( typeof $.ajax !== "function" ) throw new TypeError( "Thenable.ajaxWrap : Parameter not valid" );
    var wrappedAjax = function ( o ) {

        var promise = new core.Deferred();

        if ( typeof o !== "object" ) throw new TypeError( "Option parameter is not an object" );
        o.success = function ( data ) {
            promise.resolve( data );
        };

        o.error = function ( err ) {
            promise.reject( err );
        };

        $.ajax( o );

        return promise.then();
    };

};
},{"./core.js":4}],2:[function(require,module,exports){
// src/all.js
"use strict";

var core = require( "./core.js" );

function addValueToStack ( promise, stack ) {
    return function () {
        return promise.then( function ( value ) {
            stack.push( value );
        } );
    };
}

module.exports = exports = function ( promises ) {
    /*
     * promises = [deferred]
     */
    var p       = new core.Deferred().resolve( {} );
    var promise = new core.Deferred();
    var stack   = [];
    var i, l;
    for ( i = 0, l = promises.length; i < l; i = i + 1 ) {
        p = p
            .then( addValueToStack( promises[i], stack ) )
            .fail( function ( err ) {
                promise.reject( err );
            } );
    }

    p.then( function () {
        promise.resolve( stack );
    } );

    return promise.then();
};



},{"./core.js":4}],3:[function(require,module,exports){
var promise = window.promise = require( "./promise.js" );

promise.ajaxWrap = require( "./ajaxWrap" );
},{"./ajaxWrap":1,"./promise.js":5}],4:[function(require,module,exports){
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
                then.call( value, cb[0], cb[1] );
                resolvedAsync = true;
            } else {
                return transitionTo( promise, FULFILLED, value );
            }
        } catch ( err ) {//at any point if there was an error and the cb were not called (ie : cb.first = true) we reject the deferred with the error catched

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

    //if an handler was passed, it is used, else the handler upon fulfillment will be according to the deferred a+ specs 2.2.1
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

Thenable.prototype.fail = function ( a ) {
    return this.then( null, a );
};

function Promise ( o ) {
    var self = this;
    Thenable.apply( self, arguments );
    if ( typeof o === "object" && typeof o.timeout === "number" ) {
        setTimeout( function () {
            self.reject( new Error( "Thenable : timeout " + o.timeout ) );
        } );
    }
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
    "Deferred": Promise
};
},{}],5:[function(require,module,exports){
// src/deferred.js
"use strict";
var core = require( "./core.js" );

var promise = module.exports = exports = function ( o ) {
    return new core.Deferred( o );
};

promise.reject  = function ( promise, reason ) {
    return core.Deferred.prototype.reject.call( promise, reason );
};
promise.resolve = function ( promise, value ) {
    return core.Deferred.prototype.resolve.call( promise, value );
};

promise.all  = require( "./all.js" );
promise.race = require( "./race.js" );
},{"./all.js":2,"./core.js":4,"./race.js":6}],6:[function(require,module,exports){
// src/race.js
"use strict";
var core = require( "./core.js" );

module.exports = exports = function ( promiseArray ) {
    var promise = new core.Deferred();

    var resolvePromise = function ( value ) {
        promise.resolve( value );
    };
    var rejectPromise = function ( reason ) {
        promise.reject( reason );
    };

    var i, l;
    for ( i = 0, l = promiseArray.length; i < l; i = i + 1 ) {
        promiseArray[i].then( resolvePromise, rejectPromise );
    }
    return promise.then();
};
},{"./core.js":4}]},{},[3]);
