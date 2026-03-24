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

      const read = path => readFile(`${options.cwd}/${path}`)
        .then(parse)
        .catch(node.error)

      const css = await glob(pattern, options, read)
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
