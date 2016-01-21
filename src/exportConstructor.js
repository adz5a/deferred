"use strict";

var core     = require( "./core.js" );
var Thenable = core.Thenable;

function C ( fn ) {

    var promise = this;
    core.Thenable.call( promise );

    fn.call( null, function ( value ) {

        core.Promise.prototype.resolve.call( promise, value );

    }, function ( reason ) {

        core.Promise.prototype.reject.call( promise, reason );

    } );
}

C.prototype = new Thenable();

C.resolve = function ( v ) {

    return (new core.Promise()).resolve( v );

};

C.reject = function ( r ) {

    return (new core.Promise()).reject( r );

};

module.exports = C;