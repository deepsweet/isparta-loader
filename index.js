'use strict';

var isparta = require('isparta');
var loaderUtils = require('loader-utils');
var assign = require('lodash.assign');

module.exports = function(source) {
    if (this.cacheable) {
        this.cacheable();
    }

    var options = loaderUtils.parseQuery(this.query);
    var instrumenter = new isparta.Instrumenter(assign(
        {
            embedSource: true,
            noAutoWrap: true
        },
        options
    ));

    return instrumenter.instrumentSync(source, this.resourcePath);
};
