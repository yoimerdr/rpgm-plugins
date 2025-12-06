import {SetTransformDescriptor} from "@jstls/types/core/objects/getset";
import {fromSourceTransform, toSourceTransform} from "@languages-plugin/mappers/base";
import {MapSource} from "@languages-plugin/models/source";

export const mapDescriptor: Readonly<SetTransformDescriptor<MapSource>> = {
  displayName: "n",
  messages: "m"
}


export const mapToTransform = toSourceTransform<MapSource>(mapDescriptor),
  mapFromTransform = fromSourceTransform<MapSource>(mapDescriptor);
