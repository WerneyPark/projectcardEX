const fs = require('fs');
let data = fs.readFileSync('next_f.json', 'utf8');
const matches = data.match(/\\"[a-zA-Z0-9_]+\\"\\s*:\\s*\d+/g) || [];
const set = [...new Set(matches)];
console.log(set.filter(s => !s.includes('width') && !s.includes('height') && !s.includes('size') && !s.includes('id') && !s.includes('rate') && !s.includes('diff') && !s.includes('status') && !s.includes('type') && !s.includes('Date')));
