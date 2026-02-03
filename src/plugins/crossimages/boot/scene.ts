import {extendMethod} from "@crossimages-plugin/shortcuts/cls";
import {getPrototype} from "@crossimages-plugin/shortcuts/properties";
import {generateImagesSource, generateImagesSourceFolder} from "@crossimages-plugin/files";
import {handler} from "@crossimages-plugin/handler";

export function applyFullBoot() {
    extendMethod(
        getPrototype(Scene_Boot),
        "start", {
            beforeCall() {
                const manager = DataManager;
                if (manager.isBattleTest() || manager.isEventTest())
                    return;

                if (Utils.isNwjs()) {
                    generateImagesSourceFolder();
                    generateImagesSource();
                }

                handler.setup();
            }
        }
    )
}


export function applyLiteBoot() {
    extendMethod(
        getPrototype(Scene_Boot),
        "start", {
            beforeCall: function () {
                handler.setup();
            }
        }
    )
}