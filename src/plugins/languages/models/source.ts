import {MaybeNumber} from "@jstls/types/core";
import {JsonSerializable, Nameable} from "@languages-plugin/lib";
import {KeyableObject} from "@jstls/types/core/objects";

export interface TextCommandEvent {
  parameters: string[];
  length?: MaybeNumber;
}

/**
 * The representation of commands inside events object.
 * * pageIndex -> commandIndex -> languageCommand
 */
export type LanguageTextCommand = Record<number, Record<number, TextCommandEvent>>

/**
 * The representation of events and commands inside the map or common events file.
 * * eventId -> pageIndex -> commandIndex -> languageCommand
 */
export type EventTextCommand = Record<number, LanguageTextCommand>

export interface WithTextCommands {
  messages: EventTextCommand
}

export interface Troop extends Nameable, JsonSerializable, WithTextCommands {
}


export interface MapSource extends DataMap, JsonSerializable, WithTextCommands {
}

export interface LanguageSource {
  title: string,
  terms: LangLookup,
  equipTypes: string[],
  skillTypes: string[],
  weaponTypes: string[],
  classes: string[]
  actors: DataActor[],
  enemies: string[]
  troops: Troop[]
  weapons: RPG_ItemBase[]
  armors: RPG_ItemBase[],
  items: RPG_ItemBase[],
  skills: RPG_ItemBase[]
  states: RPG_ItemBase[]
  commonEvents: WithTextCommands
  maps: KeyableObject<MapSource>,
  images: KeyableObject,
  custom: KeyableObject
}
