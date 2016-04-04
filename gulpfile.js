"use strict";
var gulp = require( "gulp" );
var source = require( "vinyl-source-stream" );
var browserify = require( "browserify" );
var uglify = require( "gulp-uglify" );
var rename = require( "gulp-rename" );

gulp.task( "bundle", function () {

    return browserify( "exporter.js" ).bundle()
        .pipe( source( "deferred.js" ) )
        .pipe( gulp.dest( "dist/" ) );

} );

gulp.task( "minify", [ "bundle" ], function () {

    return gulp.src( "dist/deferred.js" )
        .pipe( uglify() )
        .pipe( rename( "deferred.min.js" ) )
        .pipe( gulp.dest( "dist/" ) );

} );

gulp.task( "default", [ "minify" ] );