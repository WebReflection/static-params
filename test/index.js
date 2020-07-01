const {asStatic, asParams, asTag} = require('../cjs');

const a = asStatic('a');
const abc = asParams`${a}${'b'}c`;

console.assert(abc.length === 2 && abc[0].length === 2, 'expected length');
console.assert(abc[0].join('-') === 'a-c', 'expected content');
console.assert(abc[1] === 'b', 'expected hole');

const html = asTag((t, ...v) => ({t, v}));
const tagName = asStatic('tag');
const content = () => html`<${tagName}>${'content'}</${tagName}>`;

console.assert(content().t === content().t, 'same template');
console.assert(content().t.join('') === '<tag></tag>', 'correct template');
console.assert(content().v.join('-') === 'content', 'correct content');

const diff = tagName => html`<${tagName}>${'content'}</${tagName}>`;
console.assert(diff(asStatic('a')).t === diff(asStatic('a')).t, 'same template');
console.assert(diff(asStatic('a')).t !== diff(asStatic('b')).t, 'different template');
