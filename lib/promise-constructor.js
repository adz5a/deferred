"use strict";
var core = require( "./core.js" );
var
    Deferred = core.Deferred,
    Thenable = core.Thenable;
var
    resolve = Deferred.prototype.resolve,
    reject = Deferred.prototype.reject;


function Promise( fn ) {

    var deferred = new Deferred();

    this._deferred = deferred;

    try {

        fn( function ( value ) {

            deferred.resolve( value );

        }, function ( error ) {

            deferred.reject( error );

        } );

    } catch ( e ) {

        deferred.reject( e );

    }

}


Promise.prototype.then = function ( onFullfill, onError ) {
    return this._deferred.promise.then( onFullfill, onError );
};

Promise.prototype[ "catch" ] = function ( errorHandler ) {

    return this._deferred.promise.then( errorHandler );

};
module.exports = Promise;
