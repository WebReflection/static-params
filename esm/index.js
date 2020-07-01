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
  const {t, v} = parse(template, values);
  const parsed = cache.get(template) || cache.set(template, {}).get(template);
  return (parsed[t] || (parsed[t] = [t])).concat(v.map(i => values[i]));
};

const asTag = fn => function() {
  return fn.apply(this, asParams.apply(null, arguments));
};

export {asStatic, asParams, asTag};

function Static(v) { this.v = v; }
