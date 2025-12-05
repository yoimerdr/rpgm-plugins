import {typesConfig, varConfig} from "./base-config.mjs";


const distFolder = `dist/plugins`,
  sourceFolder = "src/plugins/core";


export default [
  varConfig(
    `${sourceFolder}/index.ts`,
    `${distFolder}/YDP_Core.js`,
    'YDP_Core',
    `${sourceFolder}/banner.ts`,
  ),
  typesConfig(
    `${sourceFolder}/types.ts`,
    `${distFolder}/YDP_Core.d.ts`,
    'YDP_Core',
  )
]
