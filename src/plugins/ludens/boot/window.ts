import {get2, set2} from "@jstls/core/objects/handlers/getset";
import {isFunction} from "@jstls/core/objects/types";
import {errors} from "@ludens-plugin/modules/errors";

/**
 * Applies error interception modifications to the global window scope.
 */
export function applyWindow(): void {
  if (get2(window, "LudensErrorRegistered")) {
    return;
  }
  set2(window, "LudensErrorRegistered", true);

  // Global uncaught error listener
  window.onerror = function (message, source, lineno, colno, error) {
    errors.report(
      typeof message === "string" ? message : "Unknown JS Error",
      source,
      lineno,
      colno,
      error
    );
    return false;
  };

  // Global unhandled promise rejection listener
  if (isFunction(window.addEventListener)) {
    window.addEventListener("unhandledrejection", function (event) {
      const reason = event.reason,
        msg = reason instanceof Error ? reason.message : String(reason),
        stack = reason instanceof Error && reason.stack ? reason.stack : "No stack trace available";
      errors.report(
        "Unhandled Promise Rejection: " + msg,
        "",
        0,
        0,
        reason instanceof Error ? reason : ({ stack } as unknown as Error)
      );
    });
  }
}
