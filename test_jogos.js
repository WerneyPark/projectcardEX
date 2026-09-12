const fs = require('fs');
let html = fs.readFileSync('scratch_jogos.html', 'utf8');
html = html.replace(/\\\//g, '/').replace(/\\"/g, '"');
const matches = html.match(/"total"\s*:\s*(\d+)/ig);
console.log(matches ? [...new Set(matches)] : 'not found');
