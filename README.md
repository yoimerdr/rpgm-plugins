# rpgm-plugins

A comprehensive collection of plugins designed for RPG Maker MV and MZ projects.
These plugins are built with TypeScript for better maintainability, type safety, and performance,
providing essential utilities, polyfills, and advanced features to streamline game development and extend functionality.

## Installation

1. Clone this repository:
   ```
   git clone https://github.com/yourusername/rpgm-plugins.git
   cd rpgm-plugins
   ```

2. Clone the dependency:
   ```
   git clone https://github.com/yourusername/jstls.git lib/jstls
   ```

3. Install dependencies:
   ```
   pnpm install
   ```

## Building

To build the plugins, use the following commands:

### Core Plugin (YDP_Core)

- Build plugin: `npm run build:core`
- Watch core: `npm run watch:core`

Built files will be in the `dist/plugins/` directory.

## Plugins

### Core Plugin (YDP_Core)

The Core plugin provides essential utilities and polyfills to simplify plugin development for RPG Maker.

#### Features

- **Polyfills**: ncludes polyfills for Promise, Fetch API, Response, and Headers for better browser compatibility. Also
  includes some polyfills for ES5 from ES6+ array, object, and string methods that other plugins will use.
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

#### Usage in RPG Maker

1. Copy `dist/plugins/[min]/YDP_Core.js` to your RPG Maker project's `js/plugins/` directory.
2. Enable the plugin in the Plugin Manager.
3. Configure the following parameters in the Plugin Manager:
    - **Enable Polyfills** (polyfills): Set to true to enable the loading of included polyfills. Default: true.
    - **Promise Polyfill** (promise): Configure how the Promise polyfill is loaded. Options: auto (load if not
      supported), include (always load), exclude (never load). Default: auto.
    - **Fetch Polyfill** (fetch): Configure how the Fetch API polyfill is loaded. Options: auto, include, exclude.
      Default: auto.
    - **Response Polyfill** (response): Configure how the Response polyfill is loaded. Options: auto, include, exclude.
      Default: auto.
    - **Headers Polyfill** (headers): Configure how the Headers polyfill is loaded. Options: auto, include, exclude.
      Default: auto.

> This plugin must be placed at the top of your plugin list, above any other plugins that depend on it.

Other plugins can depend on this core plugin for shared functionality.

#### API

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

Example:

```javascript
// Access core modules
const {requests, validations} = YDP_Core;

// Use fetchJson
requests.fetchJson('https://api.example.com/data')
  .then(data => console.log(data));
```

## Contributing

To add a new plugin:

1. Create a new directory under `src/plugins/`.
2. Add build configuration in `.build/`.
3. Update this README with plugin information.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
