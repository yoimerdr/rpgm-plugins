import {CoreFileManager, fm} from "./fs";
import {CoreLogger, logger} from "./logger";
import {CorePath, path} from "./path";

/**
 * The core environment module.
 *
 * Encapsulates environment-specific functionality and system interactions.
 * It provides access to the file system, logging mechanisms, and path manipulation utilities,
 * abstracting the underlying environment details.
 */
export interface CoreEnvironment {
  fm: CoreFileManager;
  logger: CoreLogger;
  path: CorePath
}


/**
 * The core environment module instance.
 */
export const env: CoreEnvironment = {
  fm,
  logger,
  path
}
