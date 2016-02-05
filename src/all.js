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
     * promises = [promise]
     */
    var p       = new core.Promise().resolve( {} );
    var promise = new core.Promise();
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


