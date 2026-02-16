import {getKeys, getPropertyOf} from "@languages-plugin/shortcuts/properties";
import {actorToTransform} from "@languages-plugin/mappers/actor";
import {itemToTransform} from "@languages-plugin/mappers/item";
import {eventToCommand} from "@languages-plugin/mappers/event";
import {troopToTransform} from "@languages-plugin/mappers/troop";
import {skillToTransform} from "@languages-plugin/mappers/skill";
import {stateToTransform} from "@languages-plugin/mappers/state";
import {LanguageSource, Troop, WithTextCommands} from "@languages-plugin/models/source";
import {KeyableObject} from "@jstls/types/core/objects";
import {parameters} from "@languages-plugin/parameters";
import {Maybe} from "@jstls/types/core";
import {indefinite} from "@jstls/core/utils/types";
import {each, keach} from "@languages-plugin/shortcuts/iterables";
import {get2, set2} from "@languages-plugin/shortcuts/mappers";

export function createCustomTexts(): Maybe<KeyableObject> {
  if (!parameters.enableCustom)
    return indefinite

  const source: KeyableObject = {};

  keach(
    parameters.customTexts,
    function (value: string[], key) {
      set2(source, key, {});
      each(value, function (item) {
        set2(get2(source, key), item, item);
      });
    }
  )

  return source;
}

export function createLanguageSource(): LanguageSource {
  let commonEvents: WithTextCommands = undefined!;

  let events = eventToCommand(<MapEvent>{
    id: 0,
    pages: $dataCommonEvents as any,
    name: ""
  });

  if (getKeys(events).isNotEmpty()) {
    commonEvents = {
      messages: {
        0: events
      }
    }
  }


  return {
    title: $dataSystem.gameTitle,
    actors: $dataActors.mapIf(actorToTransform),
    armors: $dataArmors.mapIf(itemToTransform),
    classes: $dataClasses.mapIf(getPropertyOf("name")),
    commonEvents,
    custom: indefinite!,
    enemies: $dataEnemies.mapIf(getPropertyOf("battlerName")),
    equipTypes: $dataSystem.equipTypes,
    images: indefinite!,
    items: $dataItems.mapIf(itemToTransform),
    maps: {},
    skillTypes: $dataSystem.skillTypes,
    skills: $dataSkills.mapIf(skillToTransform),
    states: $dataStates.mapIf(stateToTransform),
    terms: $dataSystem.terms,
    troops: $dataTroops.mapIf(value => {
      const source: KeyableObject = {
        name: value.name,
        messages: eventToCommand(value)
      }

      return troopToTransform(source as Troop)
    }),
    weaponTypes: $dataSystem.weaponTypes,
    weapons: $dataWeapons.mapIf(itemToTransform),
  }
}
