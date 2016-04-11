(function ( window, $ ) {

    "use strict";

    var deferred = require( "./deferred.js" );

    module.exports = function ( options ) {

        var response = deferred();

        options.success = function ( data ) {

            response.resolve( data );

        };

        options.error = function ( error ) {

            response.reject( error );

        };

        $.ajax( options );

        return response.promise;
    };

}( this, this.jQuery ));