# Core Plugin (YDP_Core)

The Core plugin provides essential utilities to simplify plugin development for RPG Maker.

## Features

- **Exceptions**: Standardized exception classes for error handling.
- **Classes**: Utilities for class manipulation and functional programming.
- **Requests**: Network request utilities with JSON parsing.
- **Validations**: Data validation functions.
- **Parameters**: Plugin parameter handling.
- **Properties**: Object property manipulation tools.
- **Iterables**: Iteration utilities for arrays and objects.
- **Mappers**: Data transformation functions.
- **Environment**: File system, logging, and path utilities.
- **Images**: Image file operations.

## Usage in RPG Maker

1. Copy `dist/plugins/[min]/YDP_Core.js` to your RPG Maker project's `js/plugins/` directory.
2. Enable the plugin in the Plugin Manager.

> This plugin must be placed at the top of your plugin list, above any other plugins that depend on it.

Other plugins can depend on this core plugin for shared functionality.

## API

The plugin exposes a global `YDP_Core` object with the following modules:

- `exceptions`
- `class`
- `requests`
- `validations`
- `parameters`
- `properties`
- `iterables`
- `mappers`
- `env`
- `images`

