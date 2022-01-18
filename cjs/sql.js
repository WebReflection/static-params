'use strict';
const {isArray} = Array;

class Static extends String {}

const asParams = (template, ...values) => {
  const t = [template[0]];
  const v = [t];
  for (let i = 0; i < values.length; i++) {
    if (values[i] instanceof Static)
      t[t.length - 1] += values[i] + template[i + 1];
    else {
      if (isArray(values[i])) {
        t.push(...values[i].slice(1).map(_ => ','));
        v.push(...values[i]);
      }
      else
        v.push(values[i]);
      t.push(template[i + 1]);
    }
  }
  return v;
};

const asStatic = _ => new Static(_);

const asTag = fn => function() {
  return fn.apply(this, asParams.apply(null, arguments));
};

exports.asStatic = asStatic;
exports.asParams = asParams;
exports.asTag = asTag;
