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