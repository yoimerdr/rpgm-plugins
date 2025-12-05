import {indefinite} from "@jstls/core/utils/types";
import {noact, returns} from "@jstls/core/utils";

/**
 * The options for making a directory.
 *
 * Configures the behavior of the directory creation process.
 */
export interface FSMkdirOptions {
  /**
   * If true, creates parent directories as needed.
   */
  recursive?: boolean;
}

/**
 * The state of a file manager item.
 *
 * Represents the status of a file or directory, providing methods to check its type.
 */
export interface FileManagerState {
  /**
   * Checks if the item is a directory.
   * @returns `true` if the item is a directory, `false` otherwise.
   */
  isDirectory(): boolean;
}

/**
 * The file manager interface.
 *
 * Defines the contract for file system operations. Implementations of this interface
 * provide the actual logic for interacting with the file system, whether it's the standard Node.js `fs`
 * or a mock implementation.
 */
export interface FileManager {
  /**
   * Checks if a path exists.
   * @param path The path to check.
   * @returns `true` if the path exists, `false` otherwise.
   */
  existsSync(path: string): boolean

  /**
   * Creates a directory.
   * @param path The path of the directory to create.
   * @param options Options for directory creation.
   */
  mkdirSync(path: string, options?: FSMkdirOptions): void

  /**
   * Reads the contents of a directory.
   * @param path The path of the directory to read.
   * @returns An array of file names in the directory.
   */
  readdirSync(path: string): string[]

  /**
   * Writes data to a file.
   * @param path The path of the file to write to.
   * @param data The data to write.
   */
  writeFileSync(path: string, data: string): void

  /**
   * Appends data to a file.
   * @param path The path of the file to append to.
   * @param data The data to append.
   */
  appendFileSync(path: string, data: string): void

  /**
   * Reads the contents of a file.
   * @param path The path of the file to read.
   * @returns The contents of the file as a string.
   */
  readFileSync(path: string): string,

  /**
   * Gets the status of a file or directory.
   * @param path The path to check.
   * @returns The state of the file or directory.
   */
  statSync(path: string): FileManagerState
}

let emptyFS: FileManager = indefinite!

/**
 * Returns an empty (mock) file manager.
 *
 * This file manager performs no operations and returns default values.
 * Useful for environments where file system access is not available or not needed.
 *
 * @returns The empty file manager.
 */
export function getEmptyFS(): FileManager {
  if (!emptyFS) {
    emptyFS = {
      existsSync: returns(false),
      mkdirSync: noact,
      readdirSync: returns([]),
      writeFileSync: noact,
      appendFileSync: noact,
      readFileSync: returns(''),
      statSync: returns({
        isDirectory: returns(false)
      })
    }
  }
  return emptyFS!!
}

let fs: FileManager = indefinite!

declare function require(name: "fs"): FileManager;

/**
 * Returns the active file manager.
 *
 * Automatically detects the environment (e.g., NW.js) and returns the appropriate file manager.
 * If no suitable file manager is found, it falls back to the empty file manager.
 *
 * @param reload If true, forces a reload of the file manager instance.
 * @returns The active file manager.
 */
export function getFS(reload?: boolean): FileManager {
  if (reload || !fs)
    fs = Utils.isNwjs() ? require("fs") : getEmptyFS()

  return fs;
}

/**
 * The core file manager module.
 *
 * Provides access to the file system manager. It allows retrieving the active file manager instance
 * (which adapts to the environment, e.g., Node.js or browser) or an empty/mock file manager.
 */
export interface CoreFileManager {
  /**
   * Gets the active file manager instance.
   */
  fs(): FileManager,

  /**
   * Gets an empty (mock) file manager instance.
   */
  emptyFS(): FileManager
}

/**
 * The core file manager module instance.
 */
export const fm: CoreFileManager = {
  fs: getFS,
  emptyFS: getEmptyFS
}
