# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.1] - 2026-04-22

### Fixed
- Fixed wrapping-tag parsing so multiline content is matched consistently.
- Fixed wrapping-tag cleanup for default-language text and added support for nested wrapping tags.

### Changed
- Refactored custom-text application flow to simplify internal reduction logic.

## [1.1.0] - 2026-04-16

### Added
- Escape-tag translation support for inline text lookups (for example `\L[KEY]` after escape conversion).
- Wrapping-tag translation support with configurable formats: curly (`{L}...{/L}`), square (`[L]...[/L]`), and angle (`<L>...</L>`).
- Custom text trimmers to normalize lookup keys before resolving translations.
- Optional cross-category custom-text fallbacks when a key is missing in the requested category.

### Fixed
- Fixed extraction flow so the last `Show Text` command is properly emitted instead of being skipped.
- Reduced extension callback argument usage to improve compatibility between RPG Maker MV and MZ runtimes.

## [1.0.1] - 2026-02-16

### Added
- Accept `customTexts.text` entries as `note[]` so now can accept longer, multi-line strings.

### Fixed
- Skip empty event/map objects when extracting so the JSON output no longer stores blank entries that add noise to the file.
- Fixed event translation not preserving empty lines in joined "Show Text" commands, which caused text to shift incorrectly.


## [1.0.0] - 2026-02-03

### Added
- Initial release.
- JSON-based translation system with automatic extraction.
- Support for localized image assets.
- Smart joining of "Show Text" commands for efficient translation.
- Lightweight version for optimized deployment.

