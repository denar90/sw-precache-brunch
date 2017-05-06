'use strict';

const expect = require('chai').expect;
const Plugin = require('../index');
const config = require('./fixtures/brunch.conf');

describe('Plugin', () => {
  let plugin;

  beforeEach(() => {
    plugin = new Plugin(config.default);
  });

  it('should be an object', () => {
    expect(plugin).to.be.ok;
  });

  it('should has #onCompile method', () => {
    expect(plugin.onCompile).to.be.an.instanceof(Function);
  });

  it('should has #onCompile method', () => {
    expect(plugin.compileStatic).to.be.an.instanceof(Function);
  });

  it('should has #_setConfig method', () => {
    expect(plugin._setConfig).to.be.an.instanceof(Function);
  });

  describe('Config', () => {
    it('should set default service worker file', () => {
      expect(plugin.swFileName).to.be.equal('sw.js');
      expect(plugin.swFilePath).to.be.equal('public/sw.js');
    });

    it('should set cache all files in public by default', () => {
      expect(plugin.options.staticFileGlobs[0]).to.be.equal('public/**/*.*');
    });

    describe('when swFileName was set', () => {
      beforeEach(() => {
        plugin = new Plugin(config.swFileName);
      });

      it('should set service worker file with special name', () => {
        expect(plugin.swFileName).to.be.equal('test.js');
        expect(plugin.swFilePath).to.be.equal('public/test.js');
      });
    });

    describe('when staticFileGlobs were set', () => {
      beforeEach(() => {
        plugin = new Plugin(config.staticFileGlobs);
      });

      it('should set cache for special files', () => {
        const staticFileGlobs = ['public/app.js', 'public/index.html'];
        expect(plugin.options.staticFileGlobs).to.be.deep.equal(staticFileGlobs);
      });
    });

    describe('when autorequire option', () => {
      it('should be set to false', () => {
        plugin = new Plugin(config.default);

        expect(plugin.autorequire).to.be.false;
      });

      it('should be set to true', () => {
        plugin = new Plugin(config.autorequireTrue);

        expect(plugin.autorequire).to.be.true;
      });

      it('should be set with array value', () => {
        plugin = new Plugin(config.autorequireArray);

        const expectedFilesList = ['bar.html', 'baz.html'];

        expect(plugin.autorequire).to.be.deep.equal(expectedFilesList);
      });
    });
  });

  describe('_changeFileContent', () => {
    it('should append service worker initialization into html', () => {
      const content = '<!DOCTYPE html>' +
        '<html>' +
        '  <head>' +
        '    <title>sw-precache-brunch</title>' +
        '  </head>' +
        '  <body>' +
        '  </body>' +
        '</html>';

      const expected = '<!DOCTYPE html>' +
        '<html>' +
        '  <head>' +
        '    <title>sw-precache-brunch</title>' +
        '  </head>' +
        '  <body>' +
        '  </body>' +
        '<script src="sw.js"></script>\n' +
        '<script>if (\'serviceWorker\' in navigator) navigator.serviceWorker.register(\'sw.js\')</script>\n' +
        '</html>';


      expect(plugin._changeFileContent(content)).to.be.equal(expected);
    });
  });

  describe('compileStatic', () => {

    describe('when autorequire is false', () => {

      it('should not append service worker initialization into html', () => {
        const staticContent = '<!DOCTYPE html>' +
          '<html>' +
          '  <head>' +
          '    <title>sw-precache-brunch</title>' +
          '  </head>' +
          '  <body>' +
          '  </body>' +
          '</html>';

        const expected = '<!DOCTYPE html>' +
          '<html>' +
          '  <head>' +
          '    <title>sw-precache-brunch</title>' +
          '  </head>' +
          '  <body>' +
          '  </body>' +
          '</html>';

        return plugin.compileStatic({data: staticContent, path: 'public/'}).then(content => {
          expect(content).to.equal(expected);
        });
      });
    });

    describe('when autorequire is true', () => {
      beforeEach(() => {
        plugin = new Plugin(config.autorequireTrue);
      });

      it('should append service worker initialization into html', () => {
        const staticContent = '<!DOCTYPE html>' +
          '<html>' +
          '  <head>' +
          '    <title>sw-precache-brunch</title>' +
          '  </head>' +
          '  <body>' +
          '  </body>' +
          '</html>';

        const expected = '<!DOCTYPE html>' +
          '<html>' +
          '  <head>' +
          '    <title>sw-precache-brunch</title>' +
          '  </head>' +
          '  <body>' +
          '  </body>' +
          '<script src="sw.js"></script>\n' +
          '<script>if (\'serviceWorker\' in navigator) navigator.serviceWorker.register(\'sw.js\')</script>\n' +
          '</html>';

        return plugin.compileStatic({data: staticContent, path: 'bar'}).then(content => {
          expect(content).to.equal(expected);
        });
      });
    });

    describe('when autorequire is array of pages but they are not in path', () => {
      beforeEach(() => {
        plugin = new Plugin(config.autorequireArray);
      });

      it('should append service worker initialization into html', () => {
        const staticContent = '<!DOCTYPE html>' +
          '<html>' +
          '  <head>' +
          '    <title>sw-precache-brunch</title>' +
          '  </head>' +
          '  <body>' +
          '  </body>' +
          '</html>';

        const expected = '<!DOCTYPE html>' +
          '<html>' +
          '  <head>' +
          '    <title>sw-precache-brunch</title>' +
          '  </head>' +
          '  <body>' +
          '  </body>' +
          '</html>';

        return plugin.compileStatic({data: staticContent, path: ''}).then(content => {
          expect(content).to.equal(expected);
        });
      });
    });
  });
});