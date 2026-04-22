# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2026-04-22

### Changed
- Updated boot patching to guard `_setupCssFontLoading` access safely (avoids issues when the method is missing, e.g. some MZ runtimes).
- Updated bridge payload to include `canToggleDrawEngine` based on engine (`true` for MV, `false` for MZ).
- Replaced image load interception from `ImageManager.loadBitmap` to `Bitmap.load` and now encode path only in MV non-NWJS runtime.

### Internal
- Added Ludens automated tests and Vitest project configuration.

## [1.0.1] - 2026-02-17

### Added
- Added URI encoding for image filenames in non-NWjs environments.

## [1.0.0] - 2026-01-27

### Added
- Initial release.
- Bridge features for Ludens client (Audio, FPS).
- Font loading fix for older WebViews.
