# Deferred
A promise implementation following [A+ specs](https://promisesaplus.com/).

### Tests
To install the tests library : `npm install --dev-only`

To run the tests : `npm install --only-dev && npm test` which will install the promise A+ test suite and then run all of its tests.

### In the browser

The bundle use **browserify**, so it should be installed on your path : `npm install --global browserify`.

To bundle, just run : `npm run bundle`.

It will create a *dist* folder in which will be the bundled *deferred.js*. When inserted on a page, the global variable
*deferred* is used. It can be changed easily by modifying the `exporter.js` file.

### API

#### {Function} deferred

By default, this module exports are a singe function which serves as a factory

`
    const deferred = require("deferred");
    let deferrredObject = deferred();

    deferrredObject.promise.then(value => {
        // play with my value
    }, error => {
        // handle my error
    });

`

#### {Constructor} deferred.Promise

Constructor with the same semantics as the official implementation. Can be used as a local or global polyfill.

`
    const Promise = require("deferred").Promise;

    let promise = new Promise((resolve, reject) => {

        // doing what I want...

    });


    promise.then(value => {}, error => {});

`
