# CrossImages Plugin (YDP_CrossImages)

> Deprecated: This plugin is now in maintenance mode. For new projects, use `CrossAssets`.

The specific problem this plugin solves is the inconsistency in file system case-sensitivity between Windows (development environment) and mobile platforms like Android/iOS or Linux (deployment environments).

On Windows, `Image.png` and `image.png` are treated as the same file. On Android/iOS, they are different. If you reference `image.png` in your code but the file is named `Image.png`, your game will crash on mobile devices.

This plugin scans your project's images and generates a mapping file, ensuring that requests for images always resolve to the correct, case-sensitive filename.

## Features

- **Path Standardization**: Automatically resolves case-insensitive path requests to the correct physical filename.
- **Auto-Generation**: (Standard Version) Scans specified folders and creates a JSON map of your assets.
- **Cross-Platform**: Deployment-ready solutions for mobile and web.
- **Lightweight Mode**: A separate "Light" version included for production builds that only reads the map without scanning files.

## Usage

### Setup

1. Download the latest version from [here](https://github.com/yoimerdr/rpgm-plugins/releases/tag/crossimages-latest).
2. Copy `plugins/[min]/YDP_CrossImages[.light].js` to your project's `js/plugins/` folder.
3. Enable the plugin in RPG Maker.
4. Configure the **Image Folders** parameter to include all directories you want to be case-safe (e.g., `pictures`, `enemies`, `tilesets`).

### Generating the Map

1. Run your game in a **Desktop environment** (Windows/Mac/Linux) using the **Standard Version** of the plugin.
2. The plugin will scan the directories and generate a JSON file (default: `data/crossimages/images.json`).
3. Once generated, you can deploy your game.

### Deployment

For the final build (especially for mobile), it is recommended to use the **Light Version** (`YDP_CrossImages.light.js`).
1. Ensure the JSON map has been generated.
2. Replace the Standard plugin with the Light version in the Plugin Manager.
3. The Light version will load the map and resolve paths without the overhead of file scanning.

## Versions

### YDP_CrossImages

The full version capable of scanning the file system and generating the source map. Recommended for development.

#### Parameters

- **Source Filename** (`filename`): Name of the JSON file to generate/read (default: `images`).
- **Source Directory** (`folder`): Location to store the JSON file (default: `data/crossimages`).
- **Image Folders** (`sourceFolders`): List of folders within `img/` to scan (e.g., `["system", "pictures"]`).
- **Scan All Image Folders** (`allSourceFolders`): If enabled, scans every folder inside `img/`.
    - Priority rule: when enabled, this option overrides `sourceFolders`.
- **File Generation Mode** (`generationMode`):
    - `auto`: Generate if missing.
    - `always`: Regenerate on every launch.
    - `none`: Do not generate (read-only).
- **Loading Strategy** (`loadMode`):
    - `flatten`: Flattens the object structure for faster lookup.
    - `raw`: Keeps the nested structure.

### YDP_CrossImages (Light)

A lightweight version stripped of file system scanning capabilities. It only reads the pre-generated JSON map. Recommended for release/deployment.

> The Light version requires the JSON map file to exist. You must generate it using the Standard version first.

#### Parameters

- **Source Filename** (`filename`): Name of the JSON file to read.
- **Source Directory** (`folder`): Location of the JSON file.
- **Loading Strategy** (`loadMode`): Same as Standard version.
