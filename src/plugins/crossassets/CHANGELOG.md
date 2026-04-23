# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-04-23

### Added
- Unified path standardization for both Image and Audio assets.
- Cross-folder resolution for assets requested from different directories.
- Dynamic directory scanning configured via `imageFolders` and `audioFolders`.
- Global scan flags (`allImageFolders`, `allAudioFolders`) for deep root searches.
- Flexible generation modes (`auto`, `always`, `none`).
- Production-ready Lightweight module (`YDP_CrossAssets.light.js`) for optimized read-only path resolution.
- Safe hooks for RPG Maker's `Bitmap.load` and `AudioManager.createBuffer`.
- Dynamic URI decoding and prefix validation for cache compatibility.
- `flatten` and `raw` loading strategies for data mapping.
