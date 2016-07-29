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

  it('should has #teardown method', function() {
    expect(plugin.teardown).to.be.an.instanceof(Function);
  });

  it('should has #_setConfig method', function() {
    expect(plugin._setConfig).to.be.an.instanceof(Function);
  });

  describe('Config', () => {

    it('should create default service worker file', () => {
      plugin._setConfig(config);
      expect(plugin.swFilePath).to.be.equal('public/sw.js');
    });

    it('should set cache all files in public by default', () => {
      plugin._setConfig(config);
      expect(plugin.options.staticFileGlobs[0]).to.be.equal('public/**/*.*');
    });

    it('should create service worker file with special name', () => {
      config.plugins.swPrecache.swFileName = 'test.js';
      plugin._setConfig(config);
      expect(plugin.swFilePath).to.be.equal('public/test.js');
    });

    it('should set cache for special files', () => {
      const staticFileGlobs = ['public/app.js', 'public/index.html'];
      config.plugins.swPrecache.options = {};
      config.plugins.swPrecache.options.staticFileGlobs = staticFileGlobs;
      plugin._setConfig(config);
      expect(plugin.options.staticFileGlobs).to.be.equal(staticFileGlobs);
    });
  });
});