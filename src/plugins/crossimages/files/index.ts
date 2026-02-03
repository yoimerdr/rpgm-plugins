import {Filepath, join} from "@crossimages-plugin/shortcuts/env/path";
import {parameters} from "@crossimages-plugin/parameters";
import {fs} from "@crossimages-plugin/shortcuts/env/fm";
import {FileManager} from "@core-plugin/modules/env/fs";
import {each} from "@crossimages-plugin/shortcuts/iterables";
import {concat, setobj} from "@crossimages-plugin/shortcuts/mappers";
import {indefinite} from "@jstls/core/utils/types";
import {KeyableObject} from "@jstls/types/core/objects";
import {list} from "@crossimages-plugin/shortcuts/images";

export function generateImagesSourceFolder() {
    (new Filepath(join(parameters.folder)))
        .mkdir({recursive: true, existsOk: true}, fs());
}

export function loadImagesSource(manager: FileManager) {
    const result: KeyableObject = {};

    each(parameters.sourceFolders, (folder) => {
        each(list(join("img", folder), manager), (filepath) => {
            const path = new Filepath(filepath.toLowerCase()),
                parent = path.parent,
                parts = parent ? parent.parts : [],
                sourcePath = new Filepath(filepath),
                sourcePrefix = sourcePath.prefix,
                sourceTarget = sourcePath.parent ? sourcePath.parent.join(sourcePrefix).toString() : sourcePrefix;

            setobj.apply(indefinite, concat([result] as any, parts, [path.prefix, sourceTarget]));
        });
    });

    return result;
}

export function generateImagesSource() {
    if (!Utils.isNwjs() || !Utils.isOptionValid("test") || parameters.generationMode === "none")
        return;

    const manager = fs(),
        filename = join(parameters.folder, parameters.filename + ".json"),
        mode = parameters.generationMode;


    if (!(mode === "always" || (mode === "auto" && !manager.existsSync(filename))))
        return;

    const source = loadImagesSource(manager);

    manager.writeFileSync(filename, JSON.stringify(source));

}