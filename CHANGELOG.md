# Change Log
All notable changes to this project will be documented in this file.
## [2.0.0] - 2016-12-13
### Fixed
- https://github.com/denar90/sw-precache-brunch/issues/7

### Changed
- `autorequire` API. From now path should point on original assets (e.g. `app/assets/indx.html`) instead of pointing on compiled one (e.g. `public/index.html`)

## [1.2.1] - 2016-10-18
### Fixed
- apply `autorequire` option only for assets with `html` extension
- readme

## [1.2.0] - 2016-08-05
### Added
- added autorequire option

## [1.1.0] - 2016-07-29
### Changed
- sw-precache version to 4.0.0
- write sw onCompile hook

## 1.0.0 - 2016-07-29
* Initial release

[1.1.0]: https://github.com/denar90/sw-precache-brunch/compare/v1.0.0...v1.1.0
[1.2.0]: https://github.com/denar90/sw-precache-brunch/compare/v1.1.0...v1.2.0
[1.2.1]: https://github.com/denar90/sw-precache-brunch/compare/v1.2.0...v1.2.1
[2.0.0]: https://github.com/denar90/sw-precache-brunch/compare/v2.0.0...v1.2.1