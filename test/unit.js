import fs from "node:fs/promises"
import { basename, join } from "node:path"
import postcss from "postcss"
import plugin, { importGlob } from "postcss-import-glob"
import { glob, readFile, basedir, raw } from "#utils"
import { assert, describe, it } from "#test"

const { dirname, filename } = import.meta
const fixtures = `${dirname}/fixtures`
const pattern = "*.css"
const from = join(fixtures, pattern)
const matches = await Array.fromAsync(fs.glob(from))
const [path] = matches
const file = basename(path)
const contents = await Array.fromAsync(matches, readFile)
const css = contents.join("")

async function test(css) {
  const post = await postcss([plugin]).process(css, {from})
  return post.css.trim()
}

describe("utils", () => {
  describe("`basedir`", () => {
    it("`return`s the base directory of a given file path",
      assert.equal(basedir(filename), dirname))

    it("`return`s the directory path itself, given a folder",
      assert.equal(basedir(dirname), dirname))

    it("else `return`s the `c`urrent `w`orking `d`irectory", () => {
      const cwd = process.cwd()
      assert.equal(basedir(), cwd)
      assert.equal(basedir(null), cwd)
      assert.equal(basedir(undefined), cwd)
    })
  })

  describe("`glob`", async () => {
    it("matches a given `glob` pattern", assert.length(await glob(from), 2))

    it("matches multiple `glob` patterns",
      assert.length(await glob([pattern, pattern], { cwd: fixtures }), 2))

    it("matches a subfolder `glob` pattern",
      assert.length(await glob(`${fixtures}/**/${pattern}`), 3))

    it("passes relevant options to `fs.glob`", async () => {
      const matches = await glob(from, { withFileTypes: true })
      const unique  = new Set(matches.map(match => match.parentPath))
      const {value} = unique.values().next()

      assert.length(matches, 2)
      assert.length(unique,  1)
      assert.equal(value, fixtures)
    })

    it("takes an additional `globstar` option to match nested files",
      assert.length(await glob(`${fixtures}/*${pattern}`, { globstar: true }), 3))

    it("takes an additional `dot` option to match `.paths`",
      assert.length(await glob(from, { dot: true }), 3))

    it("takes a third `function` argument to call for each match",
      assert.deepEqual(await glob(from, null, readFile), contents))
  })

  describe("`raw`", () => {
    it("unquotes a single quoted pattern", assert.equal(raw(`'${pattern}'`), pattern))
    it("unquotes a double quoted pattern", assert.equal(raw(`"${pattern}"`), pattern))

    it("extracts the raw pattern from a `url()`",
      assert.equal(raw(`url(${pattern})`), pattern))

    it("extracts the raw pattern from a single quoted `url()`",
      assert.equal(raw(`url('${pattern}')`), pattern))

    it("extracts the raw pattern from a double quoted `url()`",
      assert.equal(raw(`url("${pattern}")`), pattern))

    it("`return`s `undefined` for unmatched patterns", assert.undefined(raw("url(!*)")))
  })
})

describe("`importGlob`", async () => {
  it("`importGlob` is the `default` `export`", assert.equal(plugin, importGlob))

  describe("`@import`", async () => {
    const [css] = contents

    it("`@import`s a CSS file",
      assert.trim.equal(await test(`@import '${file}';`), css))

    it("inlcuding `url()`s",
      assert.trim.equal(await test(`@import url(${file})`), css))
  })

  it("inlines multiple `@import`s", async () => {
    const imports = path => `@import "${basename(path)}";`
    const source = matches.map(imports).join("\n")

    assert.trim.equal(await test(source), css)
  })

  describe("glob", async () => {
    const append = await glob(`${fixtures}/*/${pattern}`, null, readFile)

    it("inlines `@import`ed files matching a glob pattern",
      assert.trim.equal(await test(`@import "${pattern}";`), css))

    it("including subfolders",
      assert.trim.equal(await test(`@import "**/${pattern}";`), css + append))

    it("and `url()`s",
      assert.trim.equal(await test(`@import url(**/${pattern})`), css + append))

    it("matches 'globstar' patterns",
      assert.trim.equal(await test(`@import "*${pattern}";`), css + append))
  })
})
