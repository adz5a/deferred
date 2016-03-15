// src/promise.js
"use strict";
var core = require( "./lib/core.js" );

/**
 * @return {Deferred}
 */
var deferred = module.exports = exports = function () {
    return new core.Deferred();
};


deferred.all            = require( "./lib/all.js" );
deferred.race           = require( "./lib/race.js" );