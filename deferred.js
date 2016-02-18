// src/promise.js
"use strict";
var core = require( "./core.js" );

/**
 * @return {Deferred}
 */
var deferred = module.exports = exports = function () {
    return new core.Deferred();
};

/**
 *
 * @param promise {Deferred}
 * @param reason {*}
 */
deferred.reject  = function ( promise, reason ) {
    return core.Deferred.prototype.reject.call( promise, reason );
};

/**
 *
 * @param promise {Deferred}
 * @param value {*}
 */
deferred.resolve = function ( promise, value ) {
    return core.Deferred.prototype.resolve.call( promise, value );
};


deferred.getConstructor = require( "./exportConstructor.js" );
deferred.all            = require( "./all.js" );
deferred.race           = require( "./race.js" );