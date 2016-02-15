"use strict";
var gulp       = require( "gulp" );
var source     = require( "vinyl-source-stream" );
var browserify = require( "browserify" );
var streamify  = require( "gulp-streamify" );
var rename     = require( "gulp-rename" );
var uglify     = require( "gulp-uglify" );

gulp.task( "build-production", function () {

    var bundle = browserify( "./src/browser-adapter.js" ).bundle();

    return bundle
        .pipe( source( "deferred.js" ) )
        .pipe( streamify( uglify() ) )
        .pipe( rename( "deferred.min.js" ) )
        .pipe( gulp.dest( "./browser/" ) );

} );

gulp.task( "build-browser", function () {

    var bundle = browserify( "./src/browser-adapter.js" ).bundle();

    return bundle
        .pipe( source( "deferred.js" ) )
        .pipe( gulp.dest( "./browser/" ) );

} );