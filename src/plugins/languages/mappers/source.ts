import {getKeys, getPropertyOf} from "@languages-plugin/shortcuts/properties";
import {actorToTransform} from "@languages-plugin/mappers/actor";
import {itemToTransform} from "@languages-plugin/mappers/item";
import {eventToCommand} from "@languages-plugin/mappers/event";
import {troopToTransform} from "@languages-plugin/mappers/troop";
import {skillToTransform} from "@languages-plugin/mappers/skill";
import {stateToTransform} from "@languages-plugin/mappers/state";
import {LanguageSource, Troop, WithTextCommands} from "@languages-plugin/models/source";
import {KeyableObject} from "@jstls/types/core/objects";
import {CustomTexts, parameters} from "@languages-plugin/parameters";
import {Maybe} from "@jstls/types/core";
import {indefinite} from "@jstls/core/utils/types";
import {each, keach} from "@languages-plugin/shortcuts/iterables";
import {get2, set2} from "@languages-plugin/shortcuts/mappers";
import {isArray} from "@jstls/core/shortcuts/array";
import {isObject} from "@languages-plugin/shortcuts/validations";

// Creates an object with the same structure as CustomTexts, but with the values as objects instead of arrays.
// This allows to check if a text exists in O(1) time instead of O(n).
export function customTextsToObject(texts: CustomTexts): KeyableObject {
  const source: KeyableObject = {};

  keach(
    texts,
    function (value: string[], key) {
      set2(source, key, {});
      each(value, function (item) {
        set2(get2(source, key), item, item);
      });
    }
  )

  return source;
}

export function guessCustomTextsType(texts: CustomTexts): "array" | "object" | "unknown" {
  const textKeys = getKeys(texts),
    allArray = textKeys.every((item) => isArray(texts[item])),
    allObject = textKeys.every((item) => !isArray(texts[item]) && isObject(texts[item]));

  if (allArray)
    return "array";

  if (allObject)
    return "object";

  return "unknown";
}

export function createCustomTexts(): Maybe<CustomTexts> {
  if (!parameters.enableCustom)
    return indefinite

  const source = customTextsToObject(parameters.customTexts)

  return {
    option: (getKeys(source.option) as string[]) || [],
    status: (getKeys(source.status) as string[]) || [],
    text: (getKeys(source.text) as string[]) || [],
  };
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
