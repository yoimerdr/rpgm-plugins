# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.1] - 2026-02-16

### Added
- Accept `customTexts.text` entries as `note[]` so now can accept longer, multi-line strings.

### Fixed
- Skip empty event/map objects when extracting so the JSON output no longer stores blank entries that add noise to the file.


## [1.0.0] - 2026-02-03

### Added
- Initial release.
- JSON-based translation system with automatic extraction.
- Support for localized image assets.
- Smart joining of "Show Text" commands for efficient translation.
- Lightweight version for optimized deployment.

