import {CoreImages, images} from "./images";
import {CoreAudios, audios} from "./audios";
import {listFiles} from "./base";

/**
 * The core files module.
 *
 * Provides utilities for managing and listing files within the plugin environment.
 * This module aggregates file-related functionalities, including generic file listing
 * and specialized handling for images and audio files.
 */
export interface CoreFiles {
  list: typeof listFiles;
  /**
   * The image handling module.
   *
   * Provides utilities for working with image files, such as listing images
   * and checking supported image extensions.
   */
  images: CoreImages;
  /**
   * The audio handling module.
   *
   * Provides utilities for working with audio files, such as listing audios
   * and checking supported audio extensions.
   */
  audios: CoreAudios;
}

export const files = <CoreFiles>{
  list: listFiles,
  images,
  audios
}

export {CoreImages, CoreAudios}
