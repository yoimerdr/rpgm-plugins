///=============================================================================
/// YDP_Core | 1.0.0 | <%= moment().format('MMMM Do YYYY') %>
///=============================================================================

/*:
 * @plugindesc
 * Core library for YDP plugins. Provides essential utilities and polyfills to simplify plugin development.
 * @author Davila Yoimer
 *
 * @param polyfills
 * @type boolean
 * @text Enable Polyfills
 * @desc Set to true to enable the loading of included polyfills.
 * @default true
 *
 * @param promise
 * @text Promise Polyfill
 * @desc Configure how the Promise polyfill is loaded.
 * @parent polyfills
 * @type combo
 * @option auto
 * @option include
 * @option exclude
 * @default auto
 *
 * @param fetch
 * @text Fetch Polyfill
 * @desc Configure how the Fetch API polyfill is loaded.
 * @parent polyfills
 * @type combo
 * @option auto
 * @option include
 * @option exclude
 * @default auto
 *
 * @param response
 * @text Response Polyfill
 * @desc Configure how the Response polyfill is loaded.
 * @parent polyfills
 * @type combo
 * @option auto
 * @option include
 * @option exclude
 * @default auto
 *
 * @param headers
 * @text Headers Polyfill
 * @desc Configure how the Headers polyfill is loaded.
 * @parent polyfills
 * @type combo
 * @option auto
 * @option include
 * @option exclude
 * @default auto
 *
 * @help
 * =============================================================================
 * __   ______  ____     ____
 * \ \ / /  _ \|  _ \   / ___|___  _ __ ___
 *  \ V /| | | | |_) | | |   / _ \| '__/ _ \
 *   | | | |_| |  __/  | |__| (_) | | |  __/
 *   |_| |____/|_|      \____\___/|_|  \___|
 * =============================================================================
 *
 * YDP_Core
 * =============================================================================
 * This plugin serves as the core foundation for all YDP plugins. It includes
 * essential utilities and polyfills to ensure compatibility and simplify
 * the development of other plugins.
 *
 * Please place this plugin at the top of your plugin list, above any other
 * YDP plugins.
 *
 * =============================================================================
 * Polyfill Settings
 * =============================================================================
 * The plugin allows you to configure how polyfills are loaded:
 *
 * - Auto: The polyfill will only be loaded if the browser does not natively
 *   support the feature.
 * - Include: The polyfill will always be loaded, overriding the native
 *   implementation.
 * - Exclude: The polyfill will never be loaded.
 *
 * Available Polyfills:
 * - Promise
 * - Fetch
 * - Response
 * - Headers
 * =============================================================================
*/
