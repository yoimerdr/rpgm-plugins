import {FileManager} from "@core-plugin/modules/env/fs";
import {getter} from "@jstls/core/definer";
import {listFiles} from "./base";

/**
 * The core audio extensions.
 *
 * Defines the supported file extensions for audio files, categorized by their format type.
 */
export interface CoreAudioExtensions {
  /**
   * The encoded audio extensions.
   *
   * These extensions correspond to audio files that are encrypted or encoded, such as `.rpgmvo`.
   */
  encoded: string[];
  /**
   * The raw audio extensions.
   *
   * These extensions correspond to standard, unencrypted audio formats, such as `.ogg`.
   */
  raw: string[];
}

/**
 * The core audios module.
 *
 * Provides utilities for handling audio files within the plugin environment.
 * It includes functionality for listing audios in directories, checking for supported file extensions,
 * and managing audio format definitions.
 */
export interface CoreAudios {
  /**
   * The audio extensions configuration.
   *
   * Contains the lists of supported raw and encoded audio extensions.
   */
  readonly ext: CoreAudioExtensions;
  /**
   * The supported audio extensions.
   *
   * A flattened list of all supported audio extensions (both raw and encoded).
   */
  readonly extensions: string[];

  /**
   * Checks if the given filename is supported.
   *
   * Determines whether a file is considered a valid audio file based on its extension.
   *
   * @param filename The filename to check.
   * @returns `true` if the filename has a supported extension, `false` otherwise.
   */
  isSupported(filename: string): boolean;

  /**
   * Lists the audios in the given folder.
   *
   * Scans the specified directory (and recursively its subdirectories) for files
   * that match the supported audio extensions.
   *
   * @param folder The folder to list the audios from.
   * @param fs The file manager to use. If not provided, the default file manager is used.
   * @returns An array of absolute file paths to the found audios.
   */
  list(folder: string, fs?: FileManager): string[];
}

/**
 * The core audios module instance.
 */
export const audios = <CoreAudios>{
  ext: {
    encoded: [".rpgmvo", ".rpgmvm", ".ogg_", ".m4a_"],
    raw: [".ogg", ".m4a"]
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

getter(audios, "extensions", function () {
  const ext = this.ext;

  return ext.raw
    .concat(ext.encoded)
})
