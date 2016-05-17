"use strict";
var deferred = require( "./../deferred" );
var _ = require( "lodash" );
var test = require( "tape" );

test( "Deferred.all", function ( t ) {

    t.test( "When the array is all promises", t => {

        t.plan( 1 );

        let p1 = deferred();
        let p2 = deferred();

        let p = deferred.all( [
            p1.promise,
            p2.promise
        ] );

        p2.resolve( 0 );
        p1.resolve( "lol" );


        p.then( array => {

            console.log( array );
            t.true( _.isEqual( array, [ "lol", 0 ] ), "The result is the expected array" );

        } ).catch( console.log );

    } );


    t.test( "When the array is mixed values", t => {

        t.plan( 1 );

        let expected = [
            "t1",
            "t2"
        ];
        let p1 = deferred();


        deferred.all( [
            p1.promise,
            expected[ 1 ]
        ] ).then( array => {

            t.true( _.isEqual( array, expected ), "The result is the expected array" );

        } );

        p1.resolve( expected[ 0 ] );

    } );


} );