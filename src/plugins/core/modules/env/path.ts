import {join, normalize, Path, sep} from "@jstls/core/utils/filepath";
import {WithPrototype} from "@jstls/types/core/objects";
import {funclass2} from "@jstls/core/definer/classes/funclass";
import {simple} from "@jstls/core/definer/getters/builders";
import {FileManager, getFS} from "./fs";
import {getIf} from "@jstls/core/objects/validators";
import {assign2} from "@jstls/core/objects/factory";
import {isObject} from "@jstls/core/objects/types";
import {returns} from "@jstls/core/utils";
import {Maybe} from "@jstls/types/core";
import {partial} from "@jstls/core/functions/partial";

/**
 * The options for making a directory.
 *
 * Configures the behavior of directory creation when using a `Filepath` object.
 */
export interface PathMkdirOptions {
  /**
   * If true, creates parent directories as needed.
   */
  recursive?: boolean,
  /**
   * If true, does not throw an error if the directory already exists.
   */
  existsOk?: boolean
}

/**
 * The filepath interface.
 *
 * Represents a file path and provides methods for path manipulation and file system operations
 * relative to that path. It extends the standard `Path` interface.
 */
export interface Filepath extends Path {
  /**
   * The parent directory of this path.
   * Returns `null` if the path is the root.
   */
  readonly parent: Maybe<Filepath>

  /**
   * Returns the string representation of the path.
   */
  valueOf(): string;

  withSuffix(suffix: string): Filepath

  /**
   * Creates the directory corresponding to this path.
   * @param options Options for directory creation.
   * @param fs The file manager to use.
   * @returns `true` if successful, `false` otherwise.
   */
  mkdir(options?: PathMkdirOptions, fs?: FileManager): boolean
}

/**
 * The filepath constructor interface.
 *
 * Defines the constructor for creating `Filepath` instances.
 */
export interface FilepathConstructor extends WithPrototype<Filepath> {
  /**
   * Creates a new `Filepath` instance.
   * @param path The path string or another `Filepath` object.
   */
  new(path: string | Filepath): Filepath;
}

/**
 * The Filepath class.
 *
 * Provides an object-oriented way to work with file paths.
 */
export const Filepath: FilepathConstructor = funclass2({
  prototype: {
    valueOf: partial(simple<Filepath>, "path"),
    mkdir(options?: PathMkdirOptions, fs?: FileManager): boolean {
      options = assign2(
        {
          existsOk: true,
          recursive: false
        },
        getIf(options, isObject, returns({})),
      )

      fs = getIf(fs, isObject, getFS);

      const $this = this;

      try {
        fs.mkdirSync($this.path)
        return true;
      } catch (e: any) {
        if ((e.errno == -4058 || e.code == "ENOENT")) {
          if (!options.recursive)
            throw e;
          const parent = $this.parent;
          if (!parent)
            throw e;
          parent.mkdir(options, fs)
          $this.mkdir(options, fs)
          return true;
        } else if ((e.errno != -4075 && e.code != "EEXIST") || !options.existsOk)
          throw e;
        return false;
      }
    }
  }
}, Path)


/**
 * The core path module.
 *
 * Provides utilities for handling file paths.
 * It includes the `Filepath` class for object-oriented path manipulation,
 * as well as standard functions for normalizing and joining paths.
 */
export interface CorePath {
  /**
   * The path segment separator (e.g., `/` or `\`).
   */
  readonly sep: string;
  /**
   * The `Filepath` class constructor.
   */
  Filepath: typeof Filepath;
  normalize: typeof normalize;
  join: typeof join;
}

/**
 * The core path module instance.
 */
export const path: CorePath = {
  sep,
  Filepath,
  normalize,
  join
}
