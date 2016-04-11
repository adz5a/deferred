(function () {

    "use strict";
    var global = typeof global === "object" && global.window ? global : window;
    var $ = global.jQuery;
    var deferred = require( "./deferred.js" );

    module.exports = function ( options ) {

        var response = deferred();

        options.success = function ( data ) {

            console.log()
            response.resolve( data );

        };

        options.error = function ( error ) {

            response.reject( error );

        };

        $.ajax( options );

        return response.promise;
    };

}());