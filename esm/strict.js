const cache = new WeakMap;

const asTag = fn => function() {
  return fn.apply(this, asParams.apply(null, arguments));
};

function asParams(template) {
  let known = cache.get(template);
  if (!known) cache.set(template, known = parse.apply(null, arguments));
  return [known.t].concat(known.v.map(i => arguments[i]));
}

function parse(template) {
  const t = [template[0]];
  const v = [];
  for (let c = 0, j = 0, i = 1, {length} = arguments; i < length; i++) {
    if (arguments[i] instanceof Static)
      t[c] += arguments[i].v + template[i];
    else {
      v[j++] = i;
      t[++c] = template[i];
    }
  }
  return {t, v};
}

const asStatic = value => new Static(value);

export {asStatic, asParams, asTag};

function Static(v) { this.v = v; }
