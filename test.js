'use strict';

const expect = require('chai').expect;
const Plugin = require('./');
let config = {
  paths: {
    public: 'public'
  },
  plugins: {
    swPrecache: {}
  }
};

describe('Plugin', () => {
  let plugin;

  beforeEach(() => {
    plugin = new Plugin(config);
  });

  it('should be an object', () => {
    expect(plugin).to.be.ok;
  });

  it('should has #onCompile method', function() {
    expect(plugin.onCompile).to.be.an.instanceof(Function);
  });

  it('should has #_setConfig method', function() {
    expect(plugin._setConfig).to.be.an.instanceof(Function);
  });

  describe('Config', () => {

    beforeEach(() => {
      plugin._setConfig(config);
    });

    it('should set default service worker file', () => {
      expect(plugin.swFileName).to.be.equal('sw.js');
      expect(plugin.swFilePath).to.be.equal('public/sw.js');
    });

    it('should set cache all files in public by default', () => {
      expect(plugin.options.staticFileGlobs[0]).to.be.equal('public/**/*.*');
    });

    it('should set service worker file with special name', () => {
      config.plugins.swPrecache.swFileName = 'test.js';
      plugin._setConfig(config);
      expect(plugin.swFileName).to.be.equal('test.js');
      expect(plugin.swFilePath).to.be.equal('public/test.js');
    });

    it('should set cache for special files', () => {
      const staticFileGlobs = ['public/app.js', 'public/index.html'];
      config.plugins.swPrecache.options = {};
      config.plugins.swPrecache.options.staticFileGlobs = staticFileGlobs;
      plugin._setConfig(config);
      expect(plugin.options.staticFileGlobs).to.be.equal(staticFileGlobs);
    });

    describe('Autorequire', () => {
      beforeEach(() => {
        this.assetsList = [
          {
            originalPath: '',
            destinationPath: 'bar.html'
          },
          {
            originalPath: '',
            destinationPath: 'baz.html'
          },
          {
            originalPath: '',
            destinationPath: 'foo.json'
          }
        ];
      });

      it('should set false by default', () => {
        expect(plugin.autorequire).to.be.false;
      });

      it('should set true by default', () => {
        config.plugins.swPrecache.autorequire = true;
        plugin._setConfig(config);
        expect(plugin.autorequire).to.be.true;
      });

      it('should get default assets list', () => {
        const expectedFilesList = ['bar.html', 'baz.html'];
        config.plugins.swPrecache.autorequire = true;
        plugin._setConfig(config);
        const assets = plugin._getAssetsList(this.assetsList);
        expect(assets).to.deep.equal(expectedFilesList);
      });

      it('should get configurated assets list', () => {
        const filesList = ['foo.html', 'bar.html'];
        config.plugins.swPrecache.autorequire = filesList;
        plugin._setConfig(config);
        const assets = plugin._getAssetsList(this.assetsList);
        expect(assets).to.deep.equal(filesList);
      });

      it('filter should return only assets with html extention', () => {
        const filesList = ['bar.html', 'baz.html', 'foo.json'];
        const expectedFilesList = ['bar.html', 'baz.html'];
        const assets = plugin._filterHtmlAssets(filesList);
        expect(assets).to.deep.equal(expectedFilesList);
      });
    });
  });
});