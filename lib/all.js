// src/all.js
"use strict";

var Deferred = require( "./../lib/core.js" ).Deferred;
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


