# rpgm-plugins

A comprehensive collection of plugins designed for RPG Maker MV and MZ projects.
These plugins are built with TypeScript for better maintainability, type safety, and performance,
providing essential utilities and advanced features to streamline game development and extend functionality.

## Installation

Clone this repository:

```bash
git clone https://github.com/yoimerdr/rpgm-plugins.git
```

```bash
cd rpgm-plugins
```

Clone the dependency:

```bash
git clone https://github.com/yoimerdr/jstls.git lib/jstls
```

Install dependencies:

```bash
pnpm install
```

```bash
cd .build
```

```bash
pnpm install
```

## Plugins

### Core Plugin (YDP_Core)

The Core plugin provides essential utilities to simplify plugin development for RPG Maker.

See more about [here](/src/plugins/core/README.md)

## Contributing

To add a new plugin:

1. Create a new directory under `src/plugins/`.
2. Add build configuration in `.build/`.
3. Update this README with plugin link information.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
