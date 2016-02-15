// src/ajaxWrap.js
"use strict";
var core = require( "./core.js" );

module.exports = exports = function ( $ ) {
    //$ is the jquery instance
    if ( typeof $.ajax !== "function" ) throw new TypeError( "Thenable.ajaxWrap : Parameter not valid" );
    var wrappedAjax = function ( o ) {

        var promise = new core.Deferred();

        if ( typeof o !== "object" ) throw new TypeError( "Option parameter is not an object" );
        o.success = function ( data ) {
            promise.resolve( data );
        };

        o.error = function ( err ) {
            promise.reject( err );
        };

        $.ajax( o );

        return promise.then();
    };

};