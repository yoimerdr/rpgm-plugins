import {isDefined} from "@jstls/core/objects/types";
import {get2, set2} from "@jstls/core/objects/handlers/getset";
import {defineReadonly} from "@ludens-plugin/shared/property";
import {apply} from "@jstls/core/functions/apply";
import {uid} from "@jstls/core/polyfills/symbol";

/**
 * Audio settings manager for Ludens in the game.
 */
export interface LudensAudio {
  /**
   * Mutes all audio volumes by setting them to 0.
   *
   * Saves the current volume values for restoration on unmute.
   */
  mute(): void

  /**
   * Unmutes audio volumes by restoring the previously saved volume levels.
   */
  unmute(): void

  /**
   * Toggles the mute state: if currently muted, unmutes; otherwise, mutes.
   *
   * @see {isMuted}
   * @see {mute}
   * @see {unmute}
   */
  toggle(): void

  /**
   * Sets the volume for all audio types to the specified value, clamping it between 0 and 100.
   *
   * Saves the previous volume values.
   * @param value - The volume value (0-100).
   */
  volume(value: number): void

  /**
   * Whether the audio is currently muted (all volume levels are set to 0).
   */
  readonly isMuted: boolean
}


const volumes = ["bgmVolume", "bgsVolume", "meVolume", "seVolume"],
  muteKey = uid("m"),
  volumesKey = uid("v");

/**
 * Assigns a volume value to all audio types, clamping it between 0 and 100.
 *
 * Saves the previous volume values before setting the new ones.
 * @param value - The volume value to set.
 */
function assignVolume(this: LudensAudio, value: number) {
  const $this = this,
    source = AudioManager;

  value = value >> 0;
  value = value < 0 ? 0 : (value > 100 ? 100 : value);

  if (!isDefined(get2($this, volumesKey)))
    set2($this, volumesKey, {});

  volumes.forEach(function (name) {
    if (isDefined(get2(source, name))) {
      set2(
        get2($this, volumesKey),
        name,
        get2(source, name)
      )
      set2(source, name, value)
    }
  });
}

/**
 * The audio manager.
 */
export const audio = {
  mute: function (): void {
    const $this = this;
    apply(assignVolume, $this, [0])
    set2($this, muteKey, true)
  },
  unmute: function (): void {
    const $this = this,
      saved = get2($this, volumesKey),
      source = AudioManager;

    volumes.forEach(function (name) {
      if (isDefined(get2(source, name)) && isDefined(get2(saved, name)))
        set2(source, name, get2(saved, name))
    });
    set2($this, muteKey, false)
  },
  volume: assignVolume,
  toggle: function (): void {
    const $this = this;
    if ($this.isMuted)
      $this.unmute()
    else $this.mute()
  },
} as LudensAudio

defineReadonly(
  audio,
  "isMuted",
  function (this: LudensAudio) {
    const source = AudioManager;
    return volumes.every(function (name) {
      return get2(source, name) === 0;
    })
  }
)
