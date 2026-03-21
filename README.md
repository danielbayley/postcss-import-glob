[PostCSS] `@import` [glob]
==========================
PostCSS [plugin] to inline CSS [`@import`]s, with support for [glob] patterns.

Usage
-----
`a.css`:
~~~ css
* { content: "a" }
~~~
`b.css`:
~~~ css
* { content: "b" }
~~~
~~~ js
import postcss from "postcss"
import imports from "postcss-import-glob"

const css = '@import "*.css";'
const post = await postcss([imports]).process(css, { from: undefined, to: "post.css" })
console.log(post.css)
~~~
`post.css`:
~~~ css
* { content: "a" }
* { content: "b" }
~~~

## Examples
~~~ css
@import "style.css";
@import 'style.css';
@import url(style.css);
@import url("style.css");
@import url('style.css');

@import "*.css";
@import '*.css';
@import "**/*.css";
@import url(**/*.css);
@import url(*.css);
@import url("*.css");
@import url('*.css')
~~~

## Install
~~~ sh
pnpm add postcss postcss-import-glob
~~~
> [!IMPORTANT]
> This package is _[ESM]_ [only], so must be [`import`]ed instead of [`require`]d,
> and [depends] on [_Node_.js] [`>=`][][`20`].

Specify this requirement with [`engines`] and/or [`devEngines`]:
~~~ jsonc
// package.json
"type": "module",
"engines": {
  "node": ">=20"
},
"devEngines": {
  "runtime": {
    "name": "node",
    "version": ">=20"
  }
},
~~~

License
-------
[MIT] © [Daniel Bayley]

[MIT]:                    LICENSE.md
[Daniel Bayley]:          https://github.com/danielbayley

[_Node_.js]:              https://nodejs.org
[ESM]:                    https://developer.mozilla.org/docs/Web/JavaScript/Guide/Modules
[only]:                   https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c
[`import`]:               https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/import
[`require`]:              https://nodejs.org/api/modules.html#requireid
[depends]:                https://docs.npmjs.com/cli/v11/configuring-npm/package-json#engines
[`>=`]:                   https://docs.npmjs.com/cli/v6/using-npm/semver#ranges
[`20`]:                   https://github.com/nodejs/node/blob/main/doc/changelogs/CHANGELOG_V20.md
[`engines`]:              https://docs.npmjs.com/cli/v11/configuring-npm/package-json#engines
[`devEngines`]:           https://docs.npmjs.com/cli/v11/configuring-npm/package-json#devengines

[PostCSS]:                https://postcss.org
[plugin]:                 https://postcss.org/docs/postcss-plugins
[`@import`]:              https://developer.mozilla.org/docs/Web/CSS/Reference/At-rules/@import
[glob]:                   https://globster.xyz
