"use strict";
var gulp = require( "gulp" );
var source = require( "vinyl-source-stream" );
var browserify = require( "browserify" );


gulp.task( "bundle", function () {

    return browserify( "exporter.js" ).bundle()
        .pipe( source( "deferred.js" ) )
        .pipe( gulp.dest( "dist/" ) );

} );