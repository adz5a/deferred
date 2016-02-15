"use strict";
var src     = "./../src/";
var promise = require( src + "deferred.js" );

var p1 = promise();
var p2 = promise();
var p3 = promise();
var p4 = promise();

var p = promise.all( [p1, p2, p3, p4] );

p
    .then( function ( stack ) {
        console.log( "stack " + stack );
    } )
    .fail( function ( err ) {
        console.log( "err " + err );
    } );

p2.resolve( "2" );
p1.reject( "1" );
p3.resolve("o");
p4.reject("a");