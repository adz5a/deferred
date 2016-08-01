"use strict";

module.exports = {
    deferred() {

        var output = {};
        output.promise = new Promise( ( resolve, reject ) => {

            output.resolve = resolve;
            output.reject = reject;

        } );

        return output;

    },
    resolved( value ) {

        return ( new Promise( resolve => resolve( value ) ) ).then();

    },
    rejected( error ) {

        return ( new Promise( ( _, reject ) => reject( error ) ) ).then();

    }
};
