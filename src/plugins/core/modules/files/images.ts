import {FileManager} from "@core-plugin/modules/env/fs";
import {getter} from "@jstls/core/definer";
import {listFiles} from "./base";

/**
 * The core image extensions.
 *
 * Defines the supported file extensions for images, categorized by their format type.
 */
export interface CoreImageExtensions {
  /**
   * The encoded image extensions.
   *
   * These extensions correspond to images that are encrypted or encoded, such as `.rpgmvp`.
   */
  encoded: string[];
  /**
   * The raw image extensions.
   *
   * These extensions correspond to standard, unencrypted image formats, such as `.png`.
   */
  raw: string[];
}

/**
 * The core images module.
 *
 * Provides utilities for handling image files within the plugin environment.
 * It includes functionality for listing images in directories, checking for supported file extensions,
 * and managing image format definitions.
 */
export interface CoreImages {
  /**
   * The image extensions configuration.
   *
   * Contains the lists of supported raw and encoded image extensions.
   */
  readonly ext: CoreImageExtensions;
  /**
   * The supported image extensions.
   *
   * A flattened list of all supported image extensions (both raw and encoded).
   */
  readonly extensions: string[];

  /**
   * Checks if the given filename is supported.
   *
   * Determines whether a file is considered a valid image based on its extension.
   *
   * @param filename The filename to check.
   * @returns `true` if the filename has a supported extension, `false` otherwise.
   */
  isSupported(filename: string): boolean;

  /**
   * Lists the images in the given folder.
   *
   * Scans the specified directory (and recursively its subdirectories) for files
   * that match the supported image extensions.
   *
   * @param folder The folder to list the images from.
   * @param fs The file manager to use. If not provided, the default file manager is used.
   * @returns An array of absolute file paths to the found images.
   */
  list(folder: string, fs?: FileManager): string[];
}

/**
 * The core images module instance.
 */
export const images = <CoreImages>{
  ext: {
    encoded: [".rpgmvp", ".png_"], // (.rpgmvo, .ogg, .ogg_), (.rpgmvm, .m4a, .m4a_),
    raw: [".png"]
  },
  isSupported(filename) {
    return this.extensions.some(ext => filename.endsWith(ext))
  },
  list(folder, fs) {
    const files = listFiles(folder, {
        recursive: true
      }, fs),
      $this = this;

    return files.filter($this.isSupported, $this);
  }
}

getter(images, "extensions", function () {
  const ext = this.ext;

  return ext.raw
    .concat(ext.encoded)
})
