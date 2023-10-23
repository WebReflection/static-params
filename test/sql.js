const {asStatic, asParams, asTag} = require('../cjs/sql');

const tag = asTag((template, ...values) => {
  return [template, values];
});

let [template, values] = tag`SELECT * FROM ${asStatic('table')} WHERE id IN (${[1, 2, 3]}) OR name = ${'test'}`;
console.assert(template.join('?') === 'SELECT * FROM table WHERE id IN (?,?,?) OR name = ?');
console.assert(JSON.stringify(values) === '[1,2,3,"test"]');

[template, values] = tag`SELECT * FROM ${asStatic('table')} WHERE id IN (${[4]}) OR name = ${'test'}`;
console.assert(template.join('?') === 'SELECT * FROM table WHERE id IN (?) OR name = ?');
console.assert(JSON.stringify(values) === '[4,"test"]');

[template, values] = tag`SELECT * FROM ${asStatic('table')} WHERE id IN (${[5,6]}) OR name IN (${['A', 'B']})`;
console.assert(template.join('?') === 'SELECT * FROM table WHERE id IN (?,?) OR name IN (?,?)');
console.assert(JSON.stringify(values) === '[5,6,"A","B"]');

// SQLite allows empty sets in WHERE ... IN statements
[template, values] = tag`SELECT * FROM ${asStatic('table')} WHERE name IN (${[]})`;
console.assert(template.join('?') === 'SELECT * FROM table WHERE name IN (?)');
console.assert(JSON.stringify(values) === '[""]');
