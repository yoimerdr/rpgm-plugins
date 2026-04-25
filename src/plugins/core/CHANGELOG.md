# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.2] - 2026-04-25

### Added
- Added a new files module to handle assets list (images and audios) under the `list` property.
- Extended image extension supports to include encoded image on RPG Maker MZ.

### Changed
- Now the direct `images` module is deprecated, and all image-related functionalities are accessed through the new `files` module.

## [1.0.1] - 2026-04-16

### Others
- This is a rebuild of the core plugin, due to an issue caused by method overloading that has been resolved in the external `jstls` library. 
  This version does not add any new features; it resolves a compatibility issue with certain extensions that are already implemented by the engines.

## [1.0.0] - 2026-01-27

### Added
- Standardized exception system (`exceptions`).
- Class handling utilities and mixins (`class`).
- HTTP request wrapper and network utilities (`requests`).
- Comprehensive data validation functions (`validations`).
- Plugin parameter manager (`parameters`).
- Object property and iterable utilities (`properties`, `iterables`).
- Mapper functions for data transformation (`mappers`).
- Environment, file system, and logging utilities (`env`).
- Image file operations (`images`).
