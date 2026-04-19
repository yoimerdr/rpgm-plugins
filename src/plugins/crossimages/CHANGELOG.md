# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2026-04-19

### Added
- New `allSourceFolders` parameter to scan all folders inside `img/`.
- Priority behavior for folder selection: when `allSourceFolders` is enabled, `sourceFolders` is ignored.

### Deprecated
- `YDP_CrossImages` is deprecated and in maintenance mode.
- New projects should use `CrossAssets` instead.

## [1.0.1] - 2026-02-17

### Fixed
- getImage now returns a valid value by correctly selecting the image source.

## [1.0.0] - 2026-02-03

### Added
- Initial release.
- Path standardization for cross-platform compatibility.
- Auto-generation of image path maps.
- Full generation and read-only versions.
