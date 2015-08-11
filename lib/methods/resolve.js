"use strict";
var accept = require( "./accept_reject.js" ).accept,
    reject = require( "./accept_reject.js" ).reject,
    VALID_STATES = require( "../VALID_STATES.js" );

/**
 *
 * @param {Promise} promise
 * @param x
 * @returns {boolean}
 */
function resolvePromise ( promise, x ) {


    var wasResolved = false;
    var typeX = typeof x;

    if ( x === promise ) {
        var reason = TypeError( "Promise.resolve : trying to resolve with itself" );
        promise.reject( reason );
        wasResolved = true;
        return wasResolved;
    }

    if ( promise.state !== VALID_STATES.PENDING ) {
        return wasResolved;
    }

    if ( (typeX !== "object" && typeX !== "function") || x === null) {

        wasResolved = true;
        accept( promise, x );

        return wasResolved; //stop execution and say it was resolved
    }

    //check if x is then able

    var thenMethod,
        thenAble;

    try {
        thenMethod = x.then;
    } catch ( err ) {
        reject( promise, err ); // rejected with reason
        wasResolved = true;
    } finally {
        thenAble = (typeof thenMethod === "function");
    }

    if ( wasResolved === true ) {
        return wasResolved; //stop execution and say it was resolved
    }

    if ( thenAble === true ) { // if x has been thenable
        var handlerCalled = false;
        try { // then is called synchronously
            thenMethod.call( x, function ( y ) { //onSuccess

                if ( handlerCalled === true ) {
                    return;
                }

                handlerCalled = true;
                resolvePromise( promise, y );
            }, function ( reason ) {//onError

                if ( handlerCalled === true ) {
                    return;
                }
                handlerCalled = true;
                reject( promise, reason );
            } );

        } catch ( err ) {
            if ( handlerCalled === true ) { // has throw an error but handler was called before and proceeded
                wasResolved = true;
            } else { //none of the handlers were called and it thrown
                reject( promise, err );
            }
        }

        //then may call handlers asynchronously
    } else {
        accept( promise, x );
    }


    return wasResolved;
}

module.exports.resolve = resolvePromise;