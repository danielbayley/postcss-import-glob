import fs from "node:fs/promises"
import { parse, format, join } from "node:path"

export const readFile = path => fs.readFile(path, new TextDecoder)

export const raw = string =>
  string.match(/^(?:url\()?["']?(.+\.css)["')]/)?.at(1)

export function basedir(path) {
  if (path == null) return process.cwd()
  const { dir, base, name } = parse(path)
  return base === name ? dir.length ? join(dir, name) : name : dir
}

export function glob(pattern = [], options, method) {
  options ??= {}
  const patterns = [pattern].flat()

  if (options.dot)
    pattern = patterns.flatMap(pattern => {
      const path = parse(pattern)
      path.base = `.${path.base}`
      return [format(path), pattern]
    })

  if (options.globstar)
    pattern = patterns.map(pattern => pattern.replace(/\*{2}(?=\.)/, "$&/*"))

  const matches = fs.glob(pattern, options)
  return Array.fromAsync(matches, method)
}
