import { typesConfig, varConfig } from "./base-config.mjs";
import path from "path";


const distFolder = `dist/plugins`,
    distLightFolder = `dist/plugins/light`,
    sourceFolder = "src/plugins/crossimages";


export default [
    varConfig(
        `${sourceFolder}/index.ts`,
        `${distFolder}/YDP_CrossImages.js`,
        'YDP_CrossImages',
        `${sourceFolder}/banner.js`,
        ["@core-plugin"],
        {
            "@core-plugin": "YDP_Core"
        }
    ),
    typesConfig(
        `${sourceFolder}/types.ts`,
        `${distFolder}/YDP_CrossImages.d.ts`,
        'YDP_CrossImages',
        [
            {
                find: "@crossimages-plugin",
                replacement: path.resolve("./src/plugins/crossimages")
            }
        ]
    ),
    varConfig(
        `${sourceFolder}/index.light.ts`,
        `${distLightFolder}/YDP_CrossImages.js`,
        'YDP_CrossImages',
        `${sourceFolder}/banner.light.js`,
        ["@core-plugin"],
        {
            "@core-plugin": "YDP_Core"
        }
    ),
    typesConfig(
        `${sourceFolder}/types.ts`,
        `${distLightFolder}/YDP_CrossImages.d.ts`,
        'YDP_CrossImages',
        [
            {
                find: "@crossimages-plugin",
                replacement: path.resolve("./src/plugins/crossimages")
            }
        ]
    )
]
