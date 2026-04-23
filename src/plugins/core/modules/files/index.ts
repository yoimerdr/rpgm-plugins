import {CoreImages, images} from "./images";
import {CoreAudios, audios} from "./audios";
import {listFiles} from "./base";

/**
 * The core files module.
 *
 * Provides utilities for managing and listing files within the plugin environment.
 */
export interface CoreFiles {
  /**
   * Lists files in the given folder.
   *
   * Scans the specified directory for files.
   *
   * @param folder The folder to list the files from.
   * @param options The configuration options for listing files.
   * @param fs The file manager to use. If not provided, the default file manager is used.
   * @returns An array of absolute file paths to the found files.
   */
  list: typeof listFiles;
  /**
   * The image handling module.
   */
  images: CoreImages;
  /**
   * The audio handling module.
   */
  audios: CoreAudios;
}

export const files = <CoreFiles>{
  list: listFiles,
  images,
  audios
}

export {CoreImages, CoreAudios}
