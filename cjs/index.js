'use strict';
const cache = new WeakMap;

const parse = (template, values) => {
  const t = [template[0]];
  const v = [];
  for (let c = 0, i = 1, {length} = template; i < length; i++) {
    if (values[i - 1] instanceof Static)
      t[c] += values[i - 1].v + template[i];
    else {
      v.push(i - 1);
      t[++c] = template[i];
    }
  }
  return {t, v};
};

const asStatic = value => new Static(value);

const asParams = (template, ...values) => {
  let parsed = cache.get(template);
  if (!parsed)
    cache.set(template, parsed = {});
  const {t, v} = parse(template, values);
  return (parsed[t] || (parsed[t] = [t])).concat(v.map(i => values[i]));
};

const asTag = fn => function() {
  return fn.apply(this, asParams.apply(null, arguments));
};

exports.asStatic = asStatic;
exports.asParams = asParams;
exports.asTag = asTag;

function Static(v) { this.v = v; }
