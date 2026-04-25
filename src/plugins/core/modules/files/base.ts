import {FileManager, getFS} from "@core-plugin/modules/env/fs";
import {each} from "@jstls/core/iterable/each";
import {join} from "@jstls/core/utils/filepath";
import {getDefined} from "@jstls/core/objects/validators";

/**
 * Configuration options for file listing.
 */
export interface FileListingOptions {
  /**
   * Whether to list files recursively.
   * @default false
   */
  recursive?: boolean;
}

/**
 * Base functionality for listing files.
 *
 * Provides a generic mechanism to scan directories and collect files.
 * The filtering of files should be handled by the caller based on the result of this function.
 *
 * @param path The target directory path to scan.
 * @param options The configuration options for listing files.
 * @param fs The file manager to use. If not provided, the default file manager is used.
 * @returns An array of absolute file paths to the found files.
 * @example
 * ```ts
 * // List all files in a directory recursively
 * const files = listFiles("/path/to/dir", { recursive: true });
 * 
 * // List only top-level files
 * const topLevelFiles = listFiles("/path/to/dir", { recursive: false });
 * 
 * // Use a custom file manager
 * const customFS = getCustomFileManager();
 * const files = listFiles("/path/to/dir", { recursive: true }, customFS);
 * ```
 */
export function listFiles(
  path: string,
  options: FileListingOptions,
  fs?: FileManager
): string[] {
  const fileManager = getDefined(fs, getFS),
    files: string[] = [];

  function scan(source: string) {
    each(
      fileManager.readdirSync(source),
      function (name) {
        const filepath = join(source, name);
        if (fileManager.statSync(filepath).isDirectory()) {
          if (options.recursive) {
            scan(filepath);
          }
        } else {
          files.push(filepath);
        }
      }
    );
  }

  scan(path);
  return files;
}
