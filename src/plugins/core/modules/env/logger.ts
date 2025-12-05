import {Filepath} from "@core-plugin/modules/env/path";
import {indefinite} from "@jstls/core/utils/types";
import {isDefined} from "@jstls/core/objects/types";
import {join} from "@jstls/core/utils/filepath";
import {PluginName} from "@core-plugin/parameters";
import {getFS} from "@core-plugin/modules/env/fs";
import {string} from "@jstls/core/objects/handlers";
import {concat} from "@jstls/core/shortcuts/indexable";

let path: Filepath = indefinite!;

function setpath(filepath?: string | Filepath): Filepath {
  if (!isDefined(filepath))
    path = new Filepath(join("log", PluginName, "log.txt"))
  else path = new Filepath(filepath!);

  const parent = path.parent;
  parent && parent.mkdir({
    recursive: true,
    existsOk: true
  });
  return path;
}

/**
 * Writes content to the log file.
 *
 * Overwrites the existing content of the log file.
 * Also logs the content to the console.
 *
 * @param content The content to write.
 */
export function write(content: any) {
  if (!path)
    return;

  const fs = getFS();
  content = string(content)
  fs.writeFileSync(string(path), content)
  console.log(content)
}


/**
 * Appends content to the log file.
 *
 * Adds the content to the end of the log file, followed by a newline.
 *
 * @param content The content to append.
 */
export function append(content: any) {
  if (!path)
    return;

  const fs = getFS();
  content = string(content)
  fs.appendFileSync(string(path), concat(content, "\n"))
}

/**
 * The core logger module.
 *
 * Handles logging operations within the plugin.
 * It provides functionality to set the log file path, write content to the log,
 * and append content to the existing log file.
 */
export interface CoreLogger {
  setpath: typeof setpath;
  write: typeof write;
  append: typeof append;
}

/**
 * The core logger module instance.
 */
export const logger: CoreLogger = {
  setpath,
  write,
  append
}
