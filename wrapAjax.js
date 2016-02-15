"use strict";
var promise = require("promise");//or any other deferred library

var wrappedAjax;

function wrapAjax($) {
    // $ : jQuery
    
    if (wrappedAjax) return wrappedAjax;
    
    wrappedAjax = function (o) {
        
        if (typeof o !== "object") throw new TypeError("Invalid argument for ajax call");
        
        var result = promise.defer();
        o.success = function (data, textStatus, jqXHR) {
            result.resolve([data, textStatus, jqXHR]);
        };
        
        o.error = function (jqXHR, textStatus, errorThrow) {
            result.reject([jqXHR, textStatus, errorThrow]);
        };
        
        $.ajax(o);
        return result.promise;
    };
    
    return wrappedAjax;
}

module.exports = exports = wrapAjax;