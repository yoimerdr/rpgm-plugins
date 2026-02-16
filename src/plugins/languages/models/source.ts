import {MaybeNumber} from "@jstls/types/core";
import {JsonSerializable, Nameable} from "@languages-plugin/lib";
import {KeyableObject} from "@jstls/types/core/objects";

/**
 * Represents a single text command event extracted from an RPG Maker event command.
 * Contains the parameters and optionally the length if multiple commands were joined.
 */
export interface TextCommandEvent {
  /** The parameters of the text command (first parameter usually contains the text) */
  parameters: string[];

  /**
   * The number of original commands that were joined together.
   * Present when multiple consecutive Show Text commands were merged.
   */
  length?: MaybeNumber;
}

/**
 * Represents text commands indexed by page and command position.
 * Structure: pageIndex -> commandIndex -> TextCommandEvent
 */
export type LanguageTextCommand = Record<number, Record<number, TextCommandEvent>>

/**
 * Represents text commands indexed by event ID.
 * Structure: eventId -> pageIndex -> commandIndex -> TextCommandEvent
 */
export type EventTextCommand = Record<number, LanguageTextCommand>

/**
 * Interface for objects that contain localized text commands.
 */
export interface WithTextCommands {
  /** The localized text commands for this entity */
  messages: EventTextCommand
}

/**
 * Represents a troop with translated text commands (for battle messages).
 */
export interface Troop extends Nameable, JsonSerializable, WithTextCommands {
}


/**
 * Represents a map with translated text commands.
 * Extends DataMap to include the localized event texts.
 */
export interface MapSource extends DataMap, JsonSerializable, WithTextCommands {
}

/**
 * The complete structure of a language JSON file.
 * Contains all translatable data from the RPG Maker database.
 */
export interface LanguageSource {
  /** The translated game title */
  title: string,

  /** The translated system terms (menu options, battle terms, etc.) */
  terms: LangLookup,

  /** Translated equipment type names */
  equipTypes: string[],

  /** Translated skill type names */
  skillTypes: string[],

  /** Translated weapon type names */
  weaponTypes: string[],

  /** Translated class names */
  classes: string[]

  /** Translated actor data (name, nickname, profile) */
  actors: DataActor[],

  /** Translated enemy battler names */
  enemies: string[]

  /** Translated troop data with battle messages */
  troops: Troop[]

  /** Translated weapon data */
  weapons: RPG_ItemBase[]

  /** Translated armor data */
  armors: RPG_ItemBase[],

  /** Translated item data */
  items: RPG_ItemBase[],

  /** Translated skill data */
  skills: RPG_ItemBase[]

  /** Translated state data */
  states: RPG_ItemBase[]

  /** Translated common event text commands */
  commonEvents: WithTextCommands

  /** Translated map data indexed by map ID */
  maps: KeyableObject<MapSource>,

  /** Image filename mappings for localized images */
  images: KeyableObject,

  /** Custom text translations */
  custom: KeyableObject
}
