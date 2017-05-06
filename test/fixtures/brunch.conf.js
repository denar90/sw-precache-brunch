exports.default = {
  paths: {
    public: 'public'
  },
  plugins: {}
};

exports.swFileName = {
  paths: {
    public: 'public'
  },
  plugins: {
    swPrecache: {
      swFileName: 'test.js'
    }
  }
};

exports.staticFileGlobs = {
  paths: {
    public: 'public'
  },
  plugins: {
    swPrecache: {
      options: {
        staticFileGlobs: ['public/app.js', 'public/index.html']
      }
    }
  }
};

exports.autorequireTrue = {
  paths: {
    public: 'public'
  },
  plugins: {
    swPrecache: {
      autorequire: true
    }
  }
};

exports.autorequireArray = {
  paths: {
    public: 'public'
  },
  plugins: {
    swPrecache: {
      autorequire: ['bar.html', 'baz.html']
    }
  }
};