import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import terser from "@rollup/plugin-terser";
import licence from "rollup-plugin-license";
import alias from "@rollup/plugin-alias";
import {dts} from "rollup-plugin-dts";
import path from "path";

export function varConfig(input, filepath, name, docsFilepath, external, globals) {
  const filepathParts = filepath.split("/"),
    filename = filepathParts.pop();

  filepathParts.push("min");
  filepathParts.push(filename)

  return {
    external,
    input,
    treeshake: {
      preset: 'smallest',
      annotations: true,
    },
    plugins: [
      resolve(),
      commonjs(),
      typescript({
        module: "esnext",
        target: "es5",
      })
    ],
    output: [
      {
        globals,
        file: filepath,
        format: 'iife',
        name,
        plugins: [
          terser({
            format: {
              comments: false,
              beautify: true,
            },
            compress: false,
            mangle: false
          }),
          licence({
            banner: {
              commentStyle: "none",
              content: {
                file: docsFilepath
              }
            }
          })
        ]
      },
      {
        globals,
        file: filepathParts.join("/"),
        format: 'iife',
        name,
        plugins: [
          terser(),
          licence({
            banner: {
              commentStyle: "none",
              content: {
                file: docsFilepath
              }
            }
          })
        ]
      }
    ]
  }
}

export function typesConfig(input, filepath, name, entries) {
  if (!entries) {
    entries = []
  }
  entries.push({
    find: '@jstls',
    replacement: path.resolve("./lib/jstls/src")
  })
  entries.push({
    find: "@core-plugin",
    replacement: path.resolve("./src/plugins/core")
  })

  return {
    input: input,
    plugins: [
      alias({entries: entries}),
      dts()
    ],
    output: {
      file: filepath,
      name: name,
      format: 'iife',
    },
  }
}
