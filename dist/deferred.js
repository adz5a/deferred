/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	// src/promise.js
	"use strict";
	var core = __webpack_require__( 1 );

	/**
	 * @return {Deferred}
	 */
	var deferred = module.exports = function () {
	    return new core.Deferred();
	};


	deferred.all = __webpack_require__( 2 );
	deferred.race = __webpack_require__( 3 );
	deferred.Promise = __webpack_require__( 4 );

	deferred.Promise.all = deferred.all;
	deferred.Promise.race = deferred.race;


/***/ },
/* 1 */
/***/ function(module, exports) {

	// src/core.js
	"use strict";

	var
	    PENDING = -1,
	    FULFILLED = 0,
	    REJECTED = 1;

	/**
	 *
	 * @param promise {Thenable}
	 * @param state
	 * @param value
	 * @returns {Thenable}
	 */
	function transitionTo ( promise, state, value ) {
	    if ( promise.state !== PENDING ) return promise;

	    promise.state = state;
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
	        valType = typeof value,
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
	        } catch ( err ) {//at any point if there was an error and the cb were not called (ie : cb.first = true) we reject the deferred with the
	 // error catched

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

	        for (i = 0, l = promise._next.length; i < l; i = i + 1) {
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

	    //if an handler was passed, it is used, else the handler upon fulfillment will be according to the deferred a+
	    // specs 2.2.1
	    var defaultCallbacks = thenCallbacks( this );

	    onFulfill = (typeof onFulfill === "function" ?
	        onFulfill :
	        defaultCallbacks[ 0 ]);
	    onRejection = (typeof onRejection === "function" ?
	        onRejection :
	        defaultCallbacks[ 1 ]);

	    this._handlers = [ onFulfill, onRejection ]; //_handlers qui vont transformer la valeur (erreur ou success) selon
	    this._next = [];
	    this.state = PENDING;
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
	Thenable.prototype[ "catch" ] = function ( onRejection ) {//use brackets notation for IE8
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

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	// src/all.js
	"use strict";

	var Deferred = __webpack_require__( 1 ).Deferred;
	/**
	 *
	 * @param promises {[*]}
	 * @returns {Thenable}
	 */
	module.exports = function ( promises ) {

	    // promises must be array like with a length prop of type number

	    if ( !(typeof promises === "object" && typeof promises.length === "number" && promises.length > 0) ) {
	        throw new TypeError( "Deferred.all: argument must be array-like" );
	    }

	    var resultArray   = new Array( promises.length ); // will throw a RangeError if promises.length is not a valid array length
	    var resultPromise = new Deferred();
	    var i             = -1,
	        l             = promises.length,
	        n             = l;
	    while ( ++i < l ) {

	        (function ( promise, index ) {

	            new Deferred().resolve( promise ).then( function ( v ) {

	                resultArray[ index ] = v;
	                n--;
	                if ( !n ) resultPromise.resolve( resultArray );

	            }, function ( err ) {

	                resultPromise.reject( err );

	            } )

	        }( promises[ i ], i ));

	    }

	    return resultPromise.promise;
	};




/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	// src/race.js
	"use strict";
	var core = __webpack_require__( 1 );

	function resolvePromiseFunction ( deferred ) {
	    return function ( value ) {
	        deferred.resolve( value );
	    };
	}
	function rejectPromiseFunction ( deferred ) {
	    return function ( reason ) {
	        deferred.reject( reason );
	    };
	}

	/**
	 *
	 * @param promiseArray {[Thenable]}
	 * @returns {Thenable}
	 */
	module.exports = function ( promiseArray ) {
	    var deferred = new core.Deferred();

	    var resolvePromise = resolvePromiseFunction( deferred );
	    var rejectPromise  = rejectPromiseFunction( deferred );

	    var i, l;
	    for ( i = 0, l = promiseArray.length; i < l; i = i + 1 ) {
	        promiseArray[ i ].then( resolvePromise, rejectPromise );
	    }
	    return deferred.promise;
	};

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var core = __webpack_require__( 1 );
	var Deferred = core.Deferred;

	function Promise( fn ) {

	    var deferred = new Deferred();

	    this._deferred = deferred;

	    try {

	        fn( function ( value ) {

	            deferred.resolve( value );

	        }, function ( error ) {

	            deferred.reject( error );

	        } );

	    } catch ( e ) {

	        deferred.reject( e );

	    }

	}


	Promise.prototype.then = function ( onFullfill, onError ) {
	    return this._deferred.promise.then( onFullfill, onError );
	};

	Promise.prototype[ "catch" ] = function ( errorHandler ) {

	    return this._deferred.promise.then( errorHandler );

	};
	module.exports = Promise;


/***/ }
/******/ ]);