"use strict";
var promisesAplusTests = require( "promises-aplus-tests" );
var adapter = require( "./adapter" );
var constructorAdapter = require( "./promise-constructor-adapter.js" );

promisesAplusTests( adapter, function ( err ) {
    // All done; output is in the console. Or check `err` for number of failures.
} );

promisesAplusTests( constructorAdapter, function ( err ) {
    // All done; output is in the console. Or check `err` for number of failures.
} );
