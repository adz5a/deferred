(function ( window, document, deferred ) {

    "use strict";

    function output ( text ) {

        var o       = document.createElement( "DIV" );
        o.innerHTML = text;

        document.body.appendChild( o );

    }


    function resolveAfter ( lag, value ) {

        var testee = deferred();
        setTimeout( function () {

            testee.resolve( value );

        }, lag );

        return testee.promise;
    }

    resolveAfter( 500, "testValue" ).then( function ( value ) {

        output( "i was correctly resolved with value " + value );

    } );


}( this, this.document, this.deferred ));