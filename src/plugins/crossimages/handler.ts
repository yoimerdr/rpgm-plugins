import {uid, writeable} from "@crossimages-plugin/shortcuts/properties";
import {concat, get, get2, set, set2, string} from "@crossimages-plugin/shortcuts/mappers";
import {fetchJson} from "@crossimages-plugin/shortcuts/requests";
import {Filepath, join} from "@crossimages-plugin/shortcuts/env/path";
import {parameters} from "@crossimages-plugin/parameters";
import {KeyableObject} from "@jstls/types/core/objects";
import {keach} from "@crossimages-plugin/shortcuts/iterables";
import {isObject, isString} from "@crossimages-plugin/shortcuts/validations";
import {isArray} from "@jstls/core/shortcuts/array";
import {indefinite} from "@jstls/core/utils/types";

export interface PluginHandler {
    setup(): void;

    load(): void;

    getImage(folder: string, filename: string): string;
}


export function flatobj(obj: KeyableObject, prefix: string, result: KeyableObject) {
    keach(obj, (value, key) => {
        const newKey = prefix ? join(prefix, string(key)) : string(key);
        if (isObject(value) && !isArray(value)) {
            flatobj(value, newKey, result);
        } else set2(result, newKey, value);
    });
    return result;
}

export function update(source: KeyableObject) {
    const result = parameters.loadMode == "raw" ?
        source : flatobj(
            source, "", {}
        );

    set(handler, imagesKey, result);
}


export function loadImagesSources() {
    return fetchJson(join(string(parameters.folder,), string(parameters.filename) + ".json"))
        .then(update)
        .catch(console.error);
}


const imagesKey = uid("m"),
    setupKey = uid("m"),
    handler = <PluginHandler>{
        setup() {
            const $this = this;
            $this.load();
            set($this, setupKey, true);
        },
        load() {
            loadImagesSources();
        },
        getImage(folder, filename) {
            const $this = this,
                filepath = join(string(folder), string(filename)),
                source = string(filepath)
                    .toLowerCase();

            if (!get2($this, setupKey))
                return filename;

            let result = filepath;
            if (parameters.loadMode === "raw") {
                const path = new Filepath(filepath);
                result = get.apply(
                    indefinite,
                    concat(
                        [get2($this, imagesKey)],
                        path.parts
                    ) as any
                );
            }
            else {
                result = get(
                  $this,
                  imagesKey,
                  source,
                );
            }

            if (isString(result)) {
                const path = new Filepath(result);

                return path.prefix;
            }

            return filename;
        }
    };


writeable(handler, imagesKey, {});

export {handler};