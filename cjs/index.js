'use strict';
const cache = new WeakMap;

const parse = (template, values) => {
  const t = [template[0]];
  const v = [];
  for (let c = 0, i = 0, j = 0, {length} = values; i < length; i++) {
    if (values[i] instanceof Static)
      t[c] += values[i].v + template[i + 1];
    else {
      v[j++] = i;
      t[++c] = template[i + 1];
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
