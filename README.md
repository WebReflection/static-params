# static-params

[![Build Status](https://travis-ci.com/WebReflection/static-params.svg?branch=master)](https://travis-ci.com/WebReflection/static-params) [![Coverage Status](https://coveralls.io/repos/github/WebReflection/static-params/badge.svg?branch=master)](https://coveralls.io/github/WebReflection/static-params?branch=master)

A general purpose utility to allow interpolation values as static parts of a template literal tag.

The most common use case for this utility is to solve the repeated question:

> _can [µhtml](https://github.com/WebReflection/uhtml#readme) or [lighterhtml](https://github.com/WebReflection/lighterhtml#readme) or [hyperHTML](https://github.com/WebReflection/hyperHTML#readme) use dynamic tags in the template?_

Yes, with this utility, all these libraries can finally do that, as those dynamic tags will be converted into static content.

**[Live Demo](https://codepen.io/WebReflection/pen/MWKOQbp?editors=0010)**

```js
import {asStatic, asParams, asTag} from 'static-params';
// const {asStatic, asParams, asTag} = require('static-params');
// <script src="//unpkg.com/static-params"></script>

const name = asStatic('tag');
const params = asParams`<${name}>${'content'}</${name}>`;

// params is now usable as template literal tag arguments
// [['<tag>', '</tag>'], 'content']

html(...params);
```



## API

  * `asStatic(value):Static` returns a special instance that will be merged as part of its surrounding template chunks, instead of as interpolation
  * `asParams(template, ...values):[chunks, ...holes]` returns an array usable as template literal tag arguments, after mapping all `Static` interpolations
  * `asTag(tagFunction):tag` returns a function that will automatically pass along pre transformed arguments to the initial template literal tag function

```js
import {render, html: uhtml} from 'uhtml';
import {asStatic, asTag} from 'static-params';

const html = asTag(uhtml);
const el = asStatic('h1');
render(document.body, html`<${el}>Hello 👋</${el}>`);
```

Please note that as soon as one of the static interpolations is different from the previous one, a new `template` array is returned, but same static content always result into same `template` array.



## Performance

Each call to `asParams` or `asTag`, which uses `asParams` internally, needs to loop over interpolations to understand if the result would be a different template array. This is because static interpolations could produce a different static content, so if the static interpolations are the same, the returned `template` is always the same array, but if one of these changed, the returned `template` will be a different array.

```js
const test = value => asParams`<${value} />`;

// this is always true
test(asStatic('p'))[0] === test(asStatic('p'))[0];

// but this is always false (one uses 'b', the other 'i')
test(asStatic('b'))[0] === test(asStatic('i'))[0];
```

Accordingly, it is a *very bad idea* to wrap `uhtml`, `lighterhtml`, or any similar library once, as the use case for dynamic tags, re-mapped as static content, is not so common, and every other common use case would be penalized.

It is then suggested to confine this utility as opposite of wrapping template literal tags everywhere.

```js
import {render, html} from 'uhtml';
import {asStatic, asTag} from 'static-params';


// use the specialized shtml only when needed
const shtml = asTag(html);
const el = asStatic('ul');

render(document.body, shtml`
  <${el}>${
    // use html for every other common use case
    list.map(text => html`<li>${text}</li>`)
  }</${el}>
`);
```


## Strict export usages

If none of the static parts of a template are ever going to change, the `static-params/strict` export is identical in behavior, but it's much faster thanks to its 1:1 relation with the template, so that dynamic values are mapped once and never gain per same template content.

That is: default behavior loops over template and interpolation every single time, the `strict` variant does that only once.


## Other usages

While dynamic tags as static part of the template might be the most common use case, this utility makes it possible to actually map anything as static part of a template, even partial chunks.

```js
import {asStatic, asParams} from 'static-params';

asParams`!${asStatic('<what')}ever ${'wut'}${asStatic('blah')}!`;
// [ [ '!<whatever ', 'blah!' ], 'wut' ]
```

In few words, there are no limitations regarding which part of the template should be made static, and which part is dynamic, so it is possible to create also invalid templates, but this is just what this library offers.
