import {get2, set2} from "@jstls/core/objects/handlers/getset";
import {defineReadonly} from "@ludens-plugin/shared/property";
import {isDefined, isFunction} from "@jstls/core/objects/types";
import {KeyableObject} from "@jstls/types/core/objects";

/**
 * FPS display manager for Ludens in the game.
 */
export interface LudensFps {
  /**
   * Shows the FPS counter.
   */
  show(): void

  /**
   * Hides the FPS counter.
   */
  hide(): void

  /**
   * Toggles the visibility of the FPS counter.
   */
  toggle(): void

  /**
   * Indicates if the FPS counter is currently visible.
   */
  readonly isVisible: boolean
}

/**
 * Toggles FPS display for RPG Maker MV.
 *
 * @param source - The Graphics object.
 * @param show - Whether to show or hide the FPS meter.
 */
function toggleMvFPS(source: typeof Graphics, show: boolean) {
  if (!isDefined(get2(source, "_fpsMeter")))
    return

  set2(source, "_fpsMeterToggled", false)
  if (show && isFunction(source.showFps))
    source.showFps()
  else if (!show && isFunction(source.hideFps)) source.hideFps()
}

/**
 * Toggles FPS display for RPG Maker MZ.
 * @param source - The Graphics object.
 * @param show - Whether to show or hide the FPS counter.
 */
function toggleMzFPS(source: typeof Graphics, show: boolean) {
  const counter: KeyableObject = get2(source, "_fpsCounter");
  if (!isDefined(counter))
    return;

  const style = get2(
    get2(counter, "_boxDiv",),
    "style"
  )
  if (!style || !isFunction(counter._update))
    return;

  style.display = show ? "block" : "none";
  counter._showFps = show
  counter._update()
}

/**
 * Toggles FPS display, handling both RPG Maker MV and MZ.
 * @param show - Whether to show or hide the FPS display.
 */
function toggleFPS(show: boolean) {
  const source = Graphics;

  // mv handler
  toggleMvFPS(source, show)
  toggleMzFPS(source, show)
}

/**
 * The FPS manager.
 */
export const fps = {
  show: function () {
    toggleFPS(true)
  },
  hide: function () {
    toggleFPS(false)
  },
  toggle() {
    toggleFPS(!this.isVisible)
  }
} as LudensFps

defineReadonly(
  fps,
  "isVisible",
  function (): boolean {
    const source = Graphics,
      meter: KeyableObject = get2(source, '_fpsMeter'),
      counter: KeyableObject = get2(source, '_fpsCounter');

    if (isDefined(meter))
      return !(!!meter.isPaused)
    else if (isDefined(counter))
      return !!counter._showFps

    return false
  }
)
