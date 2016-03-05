# Deferred
A promise implementation following [A+ specs](https://promisesaplus.com/).

### Tests
To install the tests library : `npm install --dev-only`

To ru the tests : `npm test`

### In the browser

To use in the browser : `npm install` then `npm build` should result in npm installing all the necessary
dependencies and then running the build script (a gulp tasks named `build-browser` which can be found
in the gulpfile). The output will be displayed inside *./browser/deferred.js* and can be used directly.