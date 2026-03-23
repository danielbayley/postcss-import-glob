import {strict} from "node:assert"
export * from "node:test"

export const assert = {...strict }

assert.undefined = unit => strict.equal(unit, undefined)

assert.length = ({ size, length = size }, n) => strict.equal(length, n)
assert.size = assert.length

assert.trim = {}

const methods = Object.keys(strict)
methods.map(method =>
  assert.trim[method] = (a, b) => assert[method](a.trim(), b.trim()))
