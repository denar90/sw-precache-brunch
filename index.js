'use strict';

const swPrecache = require('sw-precache');
const sysPath = require('path');
const defaultSWOptions = {staticFileGlobs: []};
const fs = require('fs');
const async = require('async');
const cheerio = require('cheerio');
let swFileName = 'sw.js';

class SWCompiler {

  constructor(config) {
    this._setConfig(config);
  }

  _setConfig(cfg) {
    if (cfg == null) cfg = {};
    const publicPath = cfg.paths.public;
    const config = cfg.plugins && cfg.plugins.swPrecache;

    this.swFileName = config.swFileName || swFileName;
    this.swFilePath = sysPath.join(publicPath, this.swFileName);
    this.autorequire = (Array.isArray(config.autorequire) || config.autorequire === true) ? config.autorequire : false;
    this.options = config.options || defaultSWOptions;

    if (!this.options.staticFileGlobs.length) this.options.staticFileGlobs.push(`${publicPath}/**/*.*`);
  }

  _getAssetsList(originalAssets) {
    let assets;

    originalAssets = originalAssets.map((data) => {
      return data.destinationPath;
    });

    assets = Array.isArray(this.autorequire) ? this.autorequire : originalAssets;

    return this._filterHtmlAssets(assets);
  }

  _filterHtmlAssets(assets) {
    return assets.filter(assetName => {
      return assetName.match(/\.(html)$/);
    });
  }

  _includeSWIntoAsset(assetsList) {
    async.each(assetsList, this._openFile.bind(this));
  }

  _openFile(file, cb) {
    fs.readFile(file, 'utf8', (err, fileContent) => {
      if (err) cb(err);

      try {
        this._writeFile({fileContent: this._changeFileContent(fileContent), filePath: file}, cb);
      } catch (e) {
        cb(e);
      }
    });
  }

  _changeFileContent(fileContent) {
    const $ = cheerio.load(fileContent);
    const swSource = `\<script src='${this.swFileName}'\>\<\/script\>\n`;
    const registrationScript = `\<script\>if ('serviceWorker' in navigator) navigator.serviceWorker.register('${this.swFileName}')\<\/script\>\n`;

    $('html').append(swSource, registrationScript);

    return $.html();
  }

  _writeFile(data, cb) {
    fs.writeFile(data.filePath, data.fileContent, 'utf8', (err) => {
      if (err) console.log(err);
      cb();
    });
  }

  onCompile(files, assets) {
    if (this.autorequire) {
      const assetsList = this._getAssetsList(assets);
      this._includeSWIntoAsset(assetsList);
    }

    return swPrecache.write(this.swFilePath, this.options);
  }
}

// Required for all Brunch plugins.
SWCompiler.prototype.brunchPlugin = true;
SWCompiler.prototype.type = 'javascript';

module.exports = SWCompiler;