import {get2} from "@jstls/core/objects/handlers/getset";
import {isFunction} from "@jstls/core/objects/types";

/**
 * Error settings and reporting manager for Ludens in the game.
 */
export interface LudensErrors {
  /**
   * Reports an error manually to the native Ludens bridge.
   *
   * @param message The error message.
   * @param source The source file or script where the error occurred.
   * @param lineno The line number of the error.
   * @param colno The column number of the error.
   * @param error The Error object containing the stack trace.
   */
  report(
    message: string,
    source?: string,
    lineno?: number,
    colno?: number,
    error?: Error | null
  ): void;
}

/**
 * Sends an error report to the native Ludens bridge.
 */
function reportError(
  message: string,
  source?: string,
  lineno?: number,
  colno?: number,
  error?: Error | null
): void {
  const stack = error && error.stack ? error.stack : "No stack trace available";
  const payload = {
    message: message || "Unknown JS Error",
    source: source || "unknown",
    line: lineno || 0,
    column: colno || 0,
    stackTrace: stack
  };

  const bridge = get2(window, "LudensBridge");
  if (bridge && isFunction(bridge.callNative)) {
    bridge.callNative("GameError", JSON.stringify(payload));
  }
}

/**
 * The errors manager.
 */
export const errors = {
  report: reportError
} as LudensErrors;
