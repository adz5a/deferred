"use strict";

const args = process.argv;
const isProduction = args.indexOf( "--production" ) > -1 || args.indexOf( "-p" ) > -1;

module.exports = {
    entry: {
        deferred: "./deferred.js"
    },
    output: {
        path: "dist",
        filename: isProduction ? "[name].min.js" : "[name].js"
    }
};
