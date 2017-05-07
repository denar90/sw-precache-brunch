'use strict';

const sysPath = require('path');
const swPrecache = require('sw-precache');
const cheerio = require('cheerio');
const defaultSWOptions = {staticFileGlobs: []};

class SWCompiler {

  constructor(config) {
    this._setConfig(config);
  }

  _setConfig(cfg) {
    const publicPath = cfg.paths.public;
    const config = cfg.plugins.swPrecache || {};

    this.swFileName = config.swFileName || 'sw.js';
    this.swFilePath = sysPath.join(publicPath, this.swFileName);
    this.autorequire = Array.isArray(config.autorequire) || config.autorequire === true ? config.autorequire : false;
    this.options = config.options || defaultSWOptions;

    if (!this.options.staticFileGlobs.length) this.options.staticFileGlobs.push(`${publicPath}/**/*.*`);
  }

  _changeFileContent(fileContent) {
    /* eslint-disable no-useless-escape */
    // if file service worker was included into file
    if (fileContent.indexOf(this.swFileName) >= 0) return fileContent;

    const $ = cheerio.load(fileContent);
    const swSource = `\<script src='${this.swFileName}'\>\<\/script\>\n`;
    const registrationScript = `\<script\>if ('serviceWorker' in navigator) navigator.serviceWorker.register('${this.swFileName}')\<\/script\>\n`;

    $('html').append(swSource, registrationScript);

    return $.html();
  }

  onCompile() {
    return swPrecache.write(this.swFilePath, this.options);
  }

  compileStatic(file) {
    const data = file.data;
    const path = file.path;

    if (this.autorequire === true || path.indexOf(this.autorequire) >= 0) {
      try {
        const source = this._changeFileContent(data);

        return Promise.resolve(source);
      } catch (error) {
        return Promise.reject(error);
      }
    }

    return Promise.resolve(data);
  }
}

// Required for all Brunch plugins.
SWCompiler.prototype.brunchPlugin = true;
SWCompiler.prototype.type = 'template';
SWCompiler.prototype.extension = 'html';
SWCompiler.prototype.staticTargetExtension = 'html';

module.exports = SWCompiler;
