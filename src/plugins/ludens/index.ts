import {KeyableObject} from "@jstls/types/core/objects";
import {audio, LudensAudio} from "./modules/audio";
import {fps, LudensFps} from "./modules/fps";
import {events, LudensEmitter} from "@ludens-plugin/modules/events";
import {set2} from "@jstls/core/objects/handlers/getset";
import {applyBoot} from "@ludens-plugin/boot";

declare const exports: KeyableObject

/**
 * Ludens plugin, providing access to audio, FPS, and event management for the Ludens client.
 */
export interface YDPLudens {
  /**
   * The name of the plugin.
   */
  readonly PluginName: string

  /**
   * Audio manager for controlling game audio settings.
   */
  audio: LudensAudio

  /**
   * FPS manager for displaying and hiding the FPS counter.
   */
  fps: LudensFps,

  /**
   * Event emitter for handling custom events.
   */
  events: LudensEmitter
}

set2(exports, "events", {
  on: events.on,
  off: events.off
});

applyBoot()

export {
  audio,
  fps
}
