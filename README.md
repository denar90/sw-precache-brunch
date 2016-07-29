## sw-precache-brunch
Adds [Service Worker Precache](https://github.com/GoogleChrome/sw-precache) support to
[brunch](http://brunch.io).

## Usage
Install the plugin via npm with `npm install --save sw-precache-brunch`.

Or, do manual install:

* Add `"sw-precache-brunch": "~x.y.z"` to `package.json` of your brunch app.
* If you want to use git version of plugin, use the GitHub URI
`"sw-precache-brunch": "denar90/sw-precache-brunch"`.

## Configuration

##### swFileName [String]

Filename for service worker.
> It will be placed into destination (public) brunch folder.

*Default:* `'sw.js'`

##### options [Object]

Options for `sw-precache`.

Look at all `sw-precache` available [options](https://github.com/GoogleChrome/sw-precache#options-parameter).

*Default:* `{staticFileGlobs: ['public/**/*.*']}`

> If you don't pass any configuration properties it will cache all files in your `public` folder and create `sw.js`. 
All what you need is [register service worker](https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerRegistration) for your app.

###Config example
```javascript

module.exports = {
  files: {
    javascripts: {
      joinTo: {
        'vendor.js': /^(?!app|test)/,
        'app.js': /^app/,
        'test.js': /^test/
      }
    },
    stylesheets: {joinTo: 'app.css'},
  },
  plugins: {
    babel: {presets: ['es2015']},
    swPrecache: {
      'swFileName': 'service-worker.js',
      'options': { 
        'staticFileGlobs': [
           'public/app.css',
           'public/app.js',
           'public/index.html'
        ]
      }
    }
  }
};
```

## License

MIT © [Artem Denysov](https://github.com/denar90)