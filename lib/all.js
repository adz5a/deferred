// src/all.js
"use strict";

var core = require( "./core.js" );

function addValueToStack ( i, stack ) {
    return function ( value ) {
        stack[ i ] = value;
    };
}
/**
 *
 * @param promises {[Thenable]}
 * @returns {Thenable}
 */
module.exports = function ( promises ) {
    /*
     * promises = [deferred]
     */
    var i = -1,
        l = promises.length;
    var stack = new Array( l );
    var result = new Core.Deferred();
    var reject = function ( err ) {
        result.reject( err );
    };

    while ( ++i < l ) {

        promises[ i ].then( addValueToStack( i, stack ), reject );

    }

    return result.promise;
};


