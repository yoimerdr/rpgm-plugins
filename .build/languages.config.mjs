import {typesConfig, varConfig} from "./base-config.mjs";
import path from "path";


const distFolder = `dist/plugins`,
  sourceFolder = "src/plugins/languages";


export default [
  varConfig(
    `${sourceFolder}/index.ts`,
    `${distFolder}/YDP_Languages.js`,
    'YDP_Languages',
    `${sourceFolder}/banner.js`,
    ["@core-plugin"],
    {
      "@core-plugin": "YDP_Core"
    }
  ),
  typesConfig(
    `${sourceFolder}/types.ts`,
    `${distFolder}/YDP_Languages.d.ts`,
    'YDP_Languages',
    [
      {
        find: "@languages-plugin",
        replacement: path.resolve("./src/plugins/languages")
      }
    ]
  )
]
