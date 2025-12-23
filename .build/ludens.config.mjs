import {typesConfig, varConfig} from "./base-config.mjs";
import path from "path";


const distFolder = `dist/plugins`,
  sourceFolder = "src/plugins/ludens";


export default [
  varConfig(
    `${sourceFolder}/index.ts`,
    `${distFolder}/YDP_Ludens.js`,
    'YDP_Ludens',
    `${sourceFolder}/banner.ts`,
  ),
  typesConfig(
    `${sourceFolder}/types.ts`,
    `${distFolder}/YDP_Ludens.d.ts`,
    'YDP_Ludens',
    [
      {
        find: "@ludens-plugin",
        replacement: path.resolve("./src/plugins/ludens")
      }
    ]
  )
]
