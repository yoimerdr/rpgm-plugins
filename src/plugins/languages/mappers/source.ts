import {getPropertyOf} from "@languages-plugin/shortcuts/properties";
import {actorToTransform} from "@languages-plugin/mappers/actor";
import {itemToTransform} from "@languages-plugin/mappers/item";
import {eventToCommand} from "@languages-plugin/mappers/event";
import {troopToTransform} from "@languages-plugin/mappers/troop";
import {skillToTransform} from "@languages-plugin/mappers/skill";
import {stateToTransform} from "@languages-plugin/mappers/state";
import {LanguageSource, Troop} from "@languages-plugin/models/source";
import {KeyableObject} from "@jstls/types/core/objects";

export function createLanguageSource(): LanguageSource {
  return {
    title: $dataSystem.gameTitle,
    actors: $dataActors.mapIf(actorToTransform),
    armors: $dataArmors.mapIf(itemToTransform),
    classes: $dataClasses.mapIf(getPropertyOf("name")),
    commonEvents: {
      messages: {
        0: eventToCommand(<MapEvent>{
          id: 0,
          pages: $dataCommonEvents as any,
          name: ""
        })
      }
    },
    custom: undefined!,
    enemies: $dataEnemies.mapIf(getPropertyOf("battlerName")),
    equipTypes: $dataSystem.equipTypes,
    images: undefined!,
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
    weapons: $dataWeapons.mapIf(itemToTransform)
  }
}
