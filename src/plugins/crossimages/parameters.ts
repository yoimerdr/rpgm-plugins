import {assign} from "./shortcuts/properties";
import {join} from "@crossimages-plugin/shortcuts/env/path";
import {getIf, returns} from "@crossimages-plugin/shortcuts/validations";
import {isArray} from "@jstls/core/shortcuts/array";

export type GenerateSourceMode = "auto" | "always" | "none";

export interface Parameters {
    filename: string;
    folder: string;

    sourceFolders: string[];
    generationMode: GenerateSourceMode;

    loadMode: "flatten" | "raw";
}

export const PluginName = "YDP_CrossImages",
    parameters: Parameters = {
        sourceFolders: [
            "system", "pictures",
            "titles1", "titles2"
        ],
        generationMode: "auto",

        filename: "images",
        folder: join("data", "crossimages",),
        loadMode: "flatten",
    } as Parameters;

export function setupParameters() {
    const params = PluginManager.parameters(PluginName) as any as Parameters;
    if (!params)
        return

    try {
        params.sourceFolders = getIf(JSON.parse(params.sourceFolders as any), isArray, returns([]));
    } catch (e) {
        console.error(e);
    }

    assign(parameters, params);
}
