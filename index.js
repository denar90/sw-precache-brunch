'use strict';

const swPrecache = require('sw-precache');
const sysPath = require('path');
const defaultSWOptions = {staticFileGlobs: []};
let swFileName = 'sw.js';

class SWCompiler {

  constructor(config) {
    this._setConfig(config);
  }

  _setConfig(cfg) {
    if (cfg == null) cfg = {};
    const publicPath = cfg.paths.public;
    const config = cfg.plugins && cfg.plugins.swPrecache;

    swFileName = config.swFileName || swFileName;

    this.swFilePath = sysPath.join(publicPath, swFileName);
    this.options = config.options || defaultSWOptions;
    if (!this.options.staticFileGlobs.length) this.options.staticFileGlobs.push(`${publicPath}/**/*.*`);
  }

  teardown() {
    return swPrecache.write(his.swFilePath, this.options);
  }
}

// Required for all Brunch plugins.
SWCompiler.prototype.brunchPlugin = true;
SWCompiler.prototype.type = 'javascript';
SWCompiler.prototype.extension = 'js';

module.exports = SWCompiler;