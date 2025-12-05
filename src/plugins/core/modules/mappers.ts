import {get, get2, getfirst, set, set2, setobj, setTo, setTransform} from "@jstls/core/objects/handlers/getset";
import {string} from "@jstls/core/objects/handlers";
import {concat} from "@jstls/core/shortcuts/indexable";

/**
 * The core mappers module.
 *
 * Contains utility functions for mapping, transforming, and manipulating object properties.
 * It includes tools for setting values deeply within objects, getting values safely,
 * and performing transformations on data structures.
 */
export interface CoreMappers {
  set: typeof set;
  set2: typeof set2;
  setTo: typeof setTo;
  setTransform: typeof setTransform;
  setobj: typeof setobj;

  get: typeof get;
  get2: typeof get2;
  getfirst: typeof getfirst;

  string: typeof string;
  concat: typeof concat;
}

/**
 * The core mappers module instance.
 */
export const mappers: CoreMappers = {
  set,
  set2,
  setTo,
  setTransform,
  setobj,

  get,
  get2,
  getfirst,

  string,
  concat
}
