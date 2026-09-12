const fs = require('fs');
const html = fs.readFileSync('scratch_historico.html', 'utf8');
const matches = html.match(/(https?:\/\/[^\s"]*?\.png)/g) || [];
console.log([...new Set(matches)]);
