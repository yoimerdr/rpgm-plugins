# Languages Plugin (YDP_Languages)

This plugin provides a robust localization system for your RPG Maker project, allowing you to easily translate text and
switch images based on the selected language.

## Features

- **JSON-based Translations**: Store all your text in structured JSON files.
- **Automatic Extraction**: (Standard Version) Automatically extracts game text to JSON files during development.
- **Image Localization**: Dynamically switch images (pictures, tilesets, etc.) based on the active language.
- **Smart Formatting**: Support for joining multiple "Show Text" commands into single translation entries.
- **Memory Efficient**: Options to load only the active language to save memory.
- **Lightweight Mode**: A separate "Light" version included for production builds that only reads the files without
  extraction features.

## Usage

### Setup

1. Define your supported languages in the **Supported Languages** parameter.
2. Choose a **Language Directory** (default: `data/languages`).
3. Configure the **Image Filename Pattern** if you plan to use localized images.

### Generating Translations

1. Run your game in a **Desktop environment** (Windows/Mac/Linux) using the **Standard Version** (`YDP_Languages`).
2. Set the **File Generation Mode** to `auto` or `always`.
3. The plugin will scan your game data and generate JSON files in your defined directory.
4. Edit these JSON files to add your translations.

### Deployment

For the final build (especially for mobile or web), it is recommended to use the **Light Version** (
`YDP_Languages.light.js`).

1. Ensure all translation JSON files have been generated and finalized.
2. Replace the Standard plugin with the Light version in the Plugin Manager or change th generation mode to `none`.
3. The Light version will load the translations without the overhead of file generation logic.

## Versions

### YDP_Languages

The full version capable of extracting text from the game and generating the translation files. Recommended for
development.

#### Parameters

- **Supported Languages** (`languages`)
  A list of languages that will be available in the game options. Each entry defines the code, display name, and
  language label. This is used to populate the options menu and determine which JSON file to load.

- **File Generation Mode** (`generationMode`)
  Controls when the plugin should generate/update the translation JSON files.
    - `auto`: Generates files only if they don't exist. Best for initial setup.
    - `always`: Regenerates files every time the game starts. Useful during active development when you are frequently
      adding new text.
    - `none`: Disables generation completely.

- **Loading Strategy** (`loadMode`)
  Determines how language data is managed in memory.
    - `full`: Loads all language files into memory at startup. Faster language switching but uses more RAM.
    - `lang`: Loads only the currently selected language. switches languages by loading the new file on demand. Saves
      memory.

- **Language Directory** (`folder`)
  The folder path relative to the project root where generated JSON files will be stored. Defaults to `data/languages`.

- **Join Show Text** (`joinShowText`)
  Optimizes translation files by merging consecutive "Show Text" event commands into a single string. This reduces file
  size and makes translation easier by keeping related sentences together.
    - **Separator Type** (`joinSeparatorType`):
        - `strict`: Uses the check characters exactly as written.
        - `unescaped`: Processes escape sequences (e.g., interprets `\n` as a new line).
    - **Separator Character** (`joinSeparator`): The character(s) used to join the lines (Default `\n\r`).

- **Enable Image Localization** (`enableImages`)
  Enable replacement of game images based on the active language.
    - **Image Definition Mode** (`imageMode`):
        - `all`: All images in the specified folders are candidates for localization.
        - `lang`: Only images that explicitly match the language suffix pattern are processed.
      - **Image Filename Pattern** (`imagePattern`): Defines how localized files should be named, by default the pattern
        is `${filename}.${code}`. Here you can use placeholders to define the name of the localized files:
          - `${filename}`: The original filename.
          - `${code}`: The language code (en, es, etc.).
          - `${name}`: The language name (English, Español, etc.).
          - `${label}`: The language label (Language, Idioma, etc.).

- **Enable Custom Texts** (`enableCustom`)
  Allows you to manually add a `custom` section to your JSON files for translating strings that aren't in standard database slots (e.g., hardcoded script text, dynamic texts added by plugins, etc.).
    - **Custom Texts** (`customTexts`): Define the keys and values for custom text entries that will be added to the translation files.
    - **Custom Targets** (`customTargets`):
        - `no-default`: Custom texts are NOT added to the default language file (assumes default language is the
          source).
        - `all`: Custom texts are added to all language files.

### YDP_Languages (Light)

A lightweight version stripped of extraction and generation capabilities. It only reads the pre-generated JSON files.
Recommended for release/deployment.

> The Light version requires the JSON translation files to exist. You must generate them using the Standard version first.

#### Parameters

- **Supported Languages** (`languages`): Must match the configuration in the Standard version.
- **Loading Strategy** (`loadMode`): Same options as Standard (`full` or `lang`).
- **Language Directory** (`folder`): Must match the folder where Standard version generated the files.
- **Join Show Text** (`joinShowText`): Must be enabled if the files were generated with this option turned on.
- **Enable Image Localization** (`enableImages`): Must match the Standard version setting to correctly resolve image paths.
- **Enable Custom Texts** (`enableCustom`): Defaults to `true` to ensure manual translations are loaded.

