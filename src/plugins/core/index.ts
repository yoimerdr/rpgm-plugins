import {KeyableObject} from "@jstls/types/core/objects";
import {CoreExceptions, exceptions} from "./modules/exceptions";
import {cls, CoreClasses} from "./modules/cls";
import {assign2} from "@jstls/core/objects/factory";
import {applyExtensions} from "./modules/extensions";
import {applyPolyfills} from "./modules/polyfills";
import {CoreRequests, requests} from "@core-plugin/modules/requests";
import {CoreValidations, validations} from "@core-plugin/modules/validations";
import {CoreParameters, parameters} from "@core-plugin/modules/parameters";
import {CoreProperties, properties} from "./modules/properties";
import {CoreIterables, iterables} from "./modules/iterables";
import {CoreMappers, mappers} from "./modules/mappers";
import {CoreEnvironment, env} from "./modules/env/index";
import {CoreImages, images} from "@core-plugin/modules/images";
import {readonly2} from "@jstls/core/definer";
import {PluginName, setupParameters} from "@core-plugin/parameters";
import {CoreFunctions, functions} from "@core-plugin/modules/functions";

declare const exports: KeyableObject

applyPolyfills();
applyExtensions();

/**
 * The central hub for the Core plugin.
 *
 * This interface aggregates all the core modules and utilities, providing a single access point
 * for the plugin's functionality. It serves as the main entry point for interacting with
 * the Core plugin's features, such as file system access, image handling, validations, and more.
 */
export interface YDPCore {
  /**
   * The core exceptions module.
   *
   * Provides access to standard exception classes used throughout the plugin system for error handling,
   * such as `IllegalArgumentError` and `IllegalAccessError`.
   */
  exceptions: CoreExceptions,
  /**
   * The core classes module.
   *
   * Contains utilities for class manipulation, including functional class creation (`funclass`),
   * method extension, and partial method application.
   */
  class: CoreClasses,
  /**
   * The core requests module.
   *
   * Provides utilities for making network requests, including a wrapper around the standard `fetch` API
   * and JSON-specific fetch methods.
   */
  requests: CoreRequests,
  /**
   * The core validations module.
   *
   * Offers a comprehensive set of validation functions to check data types, object structures,
   * and existence of values. Useful for enforcing contracts in function arguments.
   */
  validations: CoreValidations,
  /**
   * The core parameters module.
   *
   * Handles the parsing and retrieval of plugin parameters, ensuring they are correctly typed
   * and accessible.
   */
  parameters: CoreParameters,
  /**
   * The core properties module.
   *
   * Provides tools for defining and manipulating object properties, including utilities for
   * creating read-only properties, assigning values, and managing property descriptors.
   */
  properties: CoreProperties,
  /**
   * The core iterables module.
   *
   * Contains utility functions for iterating over various data structures, such as arrays and objects,
   * providing a unified interface for iteration.
   */
  iterables: CoreIterables,
  /**
   * The core mappers module.
   *
   * Includes functions for mapping and transforming objects and values, such as setting properties
   * based on paths or transforming data structures.
   */
  mappers: CoreMappers,
  /**
   * The core environment module.
   *
   * Encapsulates environment-specific functionality, including file system access (`fs`),
   * logging capabilities (`logger`), and path manipulation (`path`).
   */
  env: CoreEnvironment,
  /**
   * The core images module.
   *
   * Manages image file operations, including listing images in directories, checking for supported
   * extensions, and handling different image formats.
   */
  images: CoreImages,

  functions: CoreFunctions,

  /**
   * The unique name of the plugin.
   *
   * Used for identification purposes within the plugin manager and logging.
   */
  readonly PluginName: string;
}

assign2(exports, {
  class: cls
});

readonly2(exports, "PluginName", PluginName);
setupParameters();

export {
  exceptions,
  requests,
  validations,
  parameters,
  properties,
  iterables,
  mappers,
  env,
  images,
  functions
}
