import {method} from "@jstls/core/extender";
import {isFunction} from "@jstls/core/objects/types";
import {errors} from "@ludens-plugin/modules/errors";

function onSceneManagerException(e: any) {
  let message = "Unknown JS Error",
    source = "unknown",
    lineno = 0,
    colno = 0,
    error: Error | null = null;

  if (e instanceof Error) {
    message = e.name + ": " + e.message;
    error = e;
  } else if (Array.isArray(e) && e[0] === "LoadError") {
    message = "Failed to load: " + e[1];
    source = e[1];
  } else {
    message = "UnknownError: " + String(e);
  }

  errors.report(message, source, lineno, colno, error);
}

/**
 * Applies error interception modifications to the static SceneManager class.
 */
export function applySceneManager(): void {
  if (typeof SceneManager !== "undefined") {
    method(SceneManager, "catchException", {
      beforeCall: onSceneManagerException
    });
  } else if (isFunction(window.addEventListener)) {
    window.addEventListener("load", function () {
      if (typeof SceneManager !== "undefined") {
        method(SceneManager, "catchException", {
          beforeCall: onSceneManagerException
        });
      }
    });
  }
}
