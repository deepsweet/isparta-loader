'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = function (source) {
    var callback = this.async();
    var filename = _loaderUtils2.default.getRemainingRequest(this).split('!').pop();
    var query = _loaderUtils2.default.parseQuery(this.query);
    var istanbulOptions = _extends({
        embedSource: true,
        noAutoWrap: true
    }, this.options.istanbul, query.istanbul);
    var babelOptions = _extends({}, this.options.babel, query.babel);
    var ispartaOptions = _extends({}, istanbulOptions, {
        babel: babelOptions
    });
    var instrumenter = new _isparta2.default.Instrumenter(ispartaOptions);

    if (this.cacheable) {
        this.cacheable();
    }

    if (query.cacheDirectory) {
        var cacheIdentifier = JSON.stringify({
            'isparta-loader': _package2.default.version,
            'babel-core': _babelCore2.default.version,
            babelrc: (0, _resolveRc2.default)(process.cwd()),
            // TODO: .istanbul.yml
            env: process.env.BABEL_ENV || process.env.NODE_ENV
        });
        var cacheOptions = _extends({
            sourceRoot: process.cwd(),
            filename: filename,
            cacheIdentifier: cacheIdentifier
        }, ispartaOptions);

        (0, _fsCache2.default)({
            directory: query.cacheDirectory,
            identifier: query.cacheIdentifier,
            source: source,
            options: cacheOptions,
            transform: function transform(src) {
                return instrumenter.instrumentSync(src, filename);
            }
        }, function (err, result) {
            if (err) {
                return callback(err);
            }

            return callback(null, result);
        });
    } else {
        instrumenter.instrument(source, filename, function (err, code) {
            if (err) {
                return callback(err);
            }

            callback(null, code);
        });
    }
};

var _isparta = require('isparta');

var _isparta2 = _interopRequireDefault(_isparta);

var _loaderUtils = require('loader-utils');

var _loaderUtils2 = _interopRequireDefault(_loaderUtils);

var _babelCore = require('babel-core');

var _babelCore2 = _interopRequireDefault(_babelCore);

var _fsCache = require('babel-loader/lib/fs-cache');

var _fsCache2 = _interopRequireDefault(_fsCache);

var _resolveRc = require('babel-loader/lib/resolve-rc');

var _resolveRc2 = _interopRequireDefault(_resolveRc);

var _package = require('./package.json');

var _package2 = _interopRequireDefault(_package);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = exports['default'];