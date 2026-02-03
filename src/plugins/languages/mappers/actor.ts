import {SetTransformDescriptor} from "@jstls/types/core/objects/getset";
import {fromSourceTransform, toSourceTransform} from "@languages-plugin/mappers/base";

export const actorDescriptor: Readonly<SetTransformDescriptor<DataActor>> = {
  name: "n",
  nickname: "c",
  profile: "p"
};


export const actorToTransform = toSourceTransform<DataActor>(actorDescriptor),
  actorFromTransform = fromSourceTransform<DataActor>(actorDescriptor);

