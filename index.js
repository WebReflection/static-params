self.staticParams = (function (exports) {
  'use strict';

  var cache = new WeakMap();

  var parse = function parse(template, values) {
    var t = [template[0]];
    var v = [];

    for (var c = 0, i = 0, j = 0, length = values.length; i < length; i++) {
      if (values[i] instanceof Static) t[c] += values[i].v + template[i + 1];else {
        v[j++] = i;
        t[++c] = template[i + 1];
      }
    }

    return {
      t: t,
      v: v
    };
  };

  var asStatic = function asStatic(value) {
    return new Static(value);
  };

  var asParams = function asParams(template) {
    for (var _len = arguments.length, values = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      values[_key - 1] = arguments[_key];
    }

    var _parse = parse(template, values),
        t = _parse.t,
        v = _parse.v;

    var parsed = cache.get(template) || cache.set(template, {}).get(template);
    return (parsed[t] || (parsed[t] = [t])).concat(v.map(function (i) {
      return values[i];
    }));
  };

  var asTag = function asTag(fn) {
    return function () {
      return fn.apply(this, asParams.apply(null, arguments));
    };
  };

  function Static(v) {
    this.v = v;
  }

  exports.asParams = asParams;
  exports.asStatic = asStatic;
  exports.asTag = asTag;

  return exports;

}({}));
