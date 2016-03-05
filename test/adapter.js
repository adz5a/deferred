"use strict";

var promise = require( "../deferred.js" );

module.exports = {
    "deferred": function () {
        return promise();
    },
    "resolved": function ( value ) {
        return promise().resolve( value );
    },
    "rejected": function ( reason ) {
        return promise().reject( reason );
    }
};