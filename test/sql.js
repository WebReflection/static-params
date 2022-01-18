const {asStatic, asParams, asTag} = require('../cjs/sql');

const tag = asTag((template, ...values) => {
  return [template, values];
});

const [template, values] = tag`SELECT * FROM ${asStatic('table')} WHERE id IN (${[1, 2, 3]}) OR name = ${'test'}`;

console.assert(template.join('?') === 'SELECT * FROM table WHERE id IN (?,?,?) OR name = ?');
console.assert(JSON.stringify(values) === '[1,2,3,"test"]');
