// src/all.js
"use strict";

var core = require( "./core.js" );

/**
 *
 * @param promises {[Thenable]}
 * @returns {Thenable}
 */
module.exports = function ( promises ) {

    // promises must be array like with a length prop of type number

    if ( !(typeof promises === "object" && typeof promises.length === "number" && promises.length > 0) ) {
        throw new TypeError( "Deferred.all: argument must be array-like" );
    }

    var resultArray   = new Array( promises.length ); // will throw a RangeError if promises.length is not a valid array length
    var resultPromise = new core.Deferred();
    var i             = -1,
        l             = promises.length,
        n             = l;

    if ( resultArray.length === 0 ) {

        resultPromise.resolve( [] );

    } else {

        while ( ++i < l ) {

            (function ( promise, index ) {

                new core.Deferred().resolve( promise ).then( function ( v ) {

                    resultArray[ index ] = v;
                    n--;
                    if ( !n ) resultPromise.resolve( resultArray );

                }, function ( err ) {

                    resultPromise.reject( err );

                } )

            }( promises[ i ], i ));

        }

    }
    return resultPromise.promise;
};


