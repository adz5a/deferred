// src/promise.js
"use strict";
var core = require( "./core.js" );

/**
 * @return {Promise}
 */
var promise = module.exports = exports = function ( o ) {
    return new core.Promise( o );
};

promise.reject  = function ( promise, reason ) {
    return core.Promise.prototype.reject.call( promise, reason );
};
promise.resolve = function ( promise, value ) {
    return core.Promise.prototype.resolve.call( promise, value );
};


promise.getConstructor = require( "./exportConstructor.js" );
promise.all            = require( "./all.js" );
promise.race           = require( "./race.js" );