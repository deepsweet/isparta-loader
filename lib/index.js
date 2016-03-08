import isparta from 'isparta';
import loaderUtils from 'loader-utils';
import babel from 'babel-core';
import babelLoaderCache from 'babel-loader/lib/fs-cache';
import babelLoaderResolveRc from 'babel-loader/lib/resolve-rc';

import pkg from './package.json';

export default function(source) {
    const callback = this.async();
    const filename = loaderUtils.getRemainingRequest(this).split('!').pop();
    const query = loaderUtils.parseQuery(this.query);
    const istanbulOptions = {
        embedSource: true,
        noAutoWrap: true,
        ...this.options.istanbul,
        ...query.istanbul
    };
    const babelOptions = {
        ...this.options.babel,
        ...query.babel
    };
    const ispartaOptions = {
        ...istanbulOptions,
        babel: babelOptions
    };
    const instrumenter = new isparta.Instrumenter(ispartaOptions);

    if (this.cacheable) {
        this.cacheable();
    }

    if (query.cacheDirectory) {
        const cacheIdentifier = JSON.stringify({
            'isparta-loader': pkg.version,
            'babel-core': babel.version,
            babelrc: babelLoaderResolveRc(process.cwd()),
            // TODO: .istanbul.yml
            env: process.env.BABEL_ENV || process.env.NODE_ENV
        });
        const cacheOptions = {
            sourceRoot: process.cwd(),
            filename,
            cacheIdentifier,
            ...ispartaOptions
        };

        babelLoaderCache(
            {
                directory: query.cacheDirectory,
                identifier: query.cacheIdentifier,
                source,
                options: cacheOptions,
                transform(src) {
                    return instrumenter.instrumentSync(src, filename);
                }
            },
            (err, result) => {
                if (err) {
                    return callback(err);
                }

                return callback(null, result);
            }
        );
    } else {
        instrumenter.instrument(source, filename, (err, code) => {
            if (err) {
                return callback(err);
            }

            callback(null, code);
        });
    }
}
