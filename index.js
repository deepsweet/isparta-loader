'use strict';

var isparta = require('isparta');

module.exports = function(source) {
    var instrumenter = new isparta.Instrumenter({
        embedSource: true,
        noAutoWrap: true
    });

    if (this.cacheable) {
        this.cacheable();
    }

    return instrumenter.instrumentSync(source, this.resourcePath);
};
