// src/race.js
"use strict";
var core = require( "./core.js" );

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