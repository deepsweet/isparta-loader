## isparta instrumenter loader for [webpack](https://webpack.github.io/)

[![npm](http://img.shields.io/npm/v/isparta-loader.svg?style=flat-square)](https://www.npmjs.org/package/isparta-loader)
[![deps](http://img.shields.io/david/deepsweet/isparta-loader.svg?style=flat-square)](https://david-dm.org/deepsweet/isparta-loader)
[![gratipay](http://img.shields.io/gratipay/deepsweet.svg?style=flat-square)](https://gratipay.com/deepsweet/)

Instrument JS files with [isparta](https://github.com/douglasduteil/isparta) for subsequent code coverage reporting.

### Install

```sh
$ npm i -S isparta-loader
```

### Usage

Useful to get work together [karma-webpack](https://github.com/webpack/karma-webpack) and [karma-coverage](https://github.com/karma-runner/karma-coverage). For example:

1. [karma-webpack config](https://github.com/webpack/karma-webpack#karma-webpack)
2. [karma-coverage config](https://github.com/karma-runner/karma-coverage#configuration)
3. replace `karma-coverage`'s code instrumenting with `isparta-loader`'s one:

```javascript
config.set({
    ...
    files: [
      // 'lib/**/*.js', << you don't need this anymore
      'test/**/*.js'
    ],
    ...
    preprocessors: {
        // 'lib/**/*.js': ['coverage'], << and this too
        'test/**/*.js': [ 'webpack' ]
    },
    reporters: [ 'progress', 'coverage' ],
    coverageReporter: {
        type: 'text'
    },
    ...
    webpack: {
        ...
        module: {
            preLoaders: [
                // transpile test files with babel as usual
                {
                    test: /\.js$/,
                    include: path.resolve('test/'),
                    loader: 'babel'
                    // loader: 'babel?stage=1'
                },
                // transpile and instrument testing files with isparta
                {
                    test: /\.js$/,
                    include: path.resolve('lib/'),
                    loader: 'isparta'
                    // loader: 'isparta?{ noAutoWrap: false, babel: { stage: 1 } }'
                }
            ],
            loaders: [ ... ],
        },
        ...
    }
});
```

[Documentation: Using loaders](https://webpack.github.io/docs/using-loaders.html).

### License
[WTFPL](http://www.wtfpl.net/wp-content/uploads/2012/12/wtfpl-strip.jpg)
