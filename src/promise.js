// src/promise.js
"use strict";
var core = require( "./core.js" );

var promise = module.exports = exports = function ( o ) {
    return new core.Promise( o );
};

promise.reject  = function ( promise, reason ) {
    return core.Promise.prototype.reject.call( promise, reason );
};
promise.resolve = function ( promise, value ) {
    return core.Promise.prototype.resolve.call( promise, value );
};

promise.all  = require( "./all.js" );
promise.race = require( "./race.js" );