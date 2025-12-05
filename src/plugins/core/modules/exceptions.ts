import {IllegalAccessError, IllegalArgumentError, RequiredArgumentError} from "@jstls/core/exceptions";

/**
 * The core exceptions module.
 *
 * Defines the standard exception classes used across the plugin system.
 * These exceptions provide a consistent way to handle common error scenarios,
 * such as invalid arguments or illegal access attempts.
 */
export interface CoreExceptions {
  IllegalArgumentError: typeof IllegalArgumentError,
  RequiredArgumentError: typeof RequiredArgumentError,
  IllegalAccessError: typeof IllegalAccessError
}
/**
 * The core exceptions module instance.
 */
export const exceptions: CoreExceptions = {
  IllegalAccessError,
  IllegalArgumentError,
  RequiredArgumentError
}
