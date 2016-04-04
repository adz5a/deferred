"use strict";

var oldRef = window.deferred;
var deferred = require( "./deferred.js" );

deferred.noConflict = function () {

    window.deferred = oldRef;
    return this;

};


window.deferred = window.__deferred = deferred;