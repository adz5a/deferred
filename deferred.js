// src/promise.js
"use strict";
var core = require( "./lib/core.js" );

/**
 * @return {Deferred}
 */
var deferred = module.exports = function () {
    return new core.Deferred();
};


deferred.all = require( "./lib/all.js" );
deferred.race = require( "./lib/race.js" );
deferred.Promise = require( "./lib/promise-constructor.js" );

deferred.Promise.all = deferred.all;
deferred.Promise.race = deferred.race;
