"use strict";

var core     = require( "./core.js" );
var Thenable = core.Thenable;

function C ( fn ) {

    var promise = this;
    core.Thenable.call( promise );

    fn.call( null, function ( value ) {

        core.Deferred.prototype.resolve.call( promise, value );

    }, function ( reason ) {

        core.Deferred.prototype.reject.call( promise, reason );

    } );
}

C.prototype = new Thenable();

C.resolve = function ( v ) {

    return (new core.Deferred()).resolve( v );

};

C.reject = function ( r ) {

    return (new core.Deferred()).reject( r );

};

module.exports = C;