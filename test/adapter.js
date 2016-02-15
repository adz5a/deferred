"use strict";

var promise = require( "../src/deferred.js" );

module.exports = {
    "deferred": function () {
        var p = promise();

        p.promise = p;

        return p;
    },
    "resolved": function ( value ) {
        return promise().resolve( value );
    },
    "rejected": function ( reason ) {
        return promise().reject( reason );
    }
};