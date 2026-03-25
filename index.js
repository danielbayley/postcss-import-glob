import { resolve } from "node:path"
import { basedir, glob, readFile, raw } from "#utils"

import metadata from "./package.json" with { type: "json" }
const {name} = metadata

export const importGlob = options => ({
  postcssPlugin: name,
  AtRule: {
    async import(node, { parse, result }) {
      options ??= {}
      options.globstar ??= true

      const parent = result.opts.from
      const path = node.source.input.file ?? parent
      const pattern = raw(node.params)
      options.cwd ??= basedir(path)

      function read(path) {
        path = resolve(options.cwd, path)
        return readFile(path).then(parse).catch(node.error)
      }

      const css = await glob(pattern, options, read)
      if (css.length === 0)
        node.warn(result, `${node.params} did not match any files`)

      node.replaceWith(...css)

      const metadata = css.map(file => ({
        type: "dependency",
        plugin: name,
        file,
        parent,
      }))

      result.messages.push(...metadata)
    }
  }
})

importGlob.postcss = true
export default importGlob
