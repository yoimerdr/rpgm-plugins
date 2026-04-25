import {typesConfig, varConfig} from "./base-config.mjs";
import path from "path";


const distFolder = `dist/plugins`,
  distLightFolder = `dist/plugins/light`,
  sourceFolder = "src/plugins/crossassets";


export default [
  varConfig(
    `${sourceFolder}/index.ts`,
    `${distFolder}/YDP_CrossAssets.js`,
    'YDP_CrossAssets',
    `${sourceFolder}/banner.js`,
    ["@core-plugin"],
    {
      "@core-plugin": "YDP_Core"
    }
  ),
  typesConfig(
    `${sourceFolder}/types.ts`,
    `${distFolder}/YDP_CrossAssets.d.ts`,
    'YDP_CrossAssets',
    [
      {
        find: "@crossassets-plugin",
        replacement: path.resolve("./src/plugins/crossassets")
      }
    ]
  ),
  varConfig(
    `${sourceFolder}/index.light.ts`,
    `${distLightFolder}/YDP_CrossAssets.js`,
    'YDP_CrossAssets',
    `${sourceFolder}/banner.light.js`,
    ["@core-plugin"],
    {
      "@core-plugin": "YDP_Core"
    }
  ),
  typesConfig(
    `${sourceFolder}/types.ts`,
    `${distLightFolder}/YDP_CrossAssets.d.ts`,
    'YDP_CrossAssets',
    [
      {
        find: "@crossassets-plugin",
        replacement: path.resolve("./src/plugins/crossassets")
      }
    ]
  )
]
