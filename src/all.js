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
            .catch( function ( err ) {
                promise.reject( err );
            } );
    }

    p.then( function () {
        promise.resolve( stack );
    } );

    return promise.then();
};


