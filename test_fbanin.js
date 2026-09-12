const fs = require('fs');
let html = fs.readFileSync('scratch_fbanin.html', 'utf8');
html = html.replace(/\\\//g, '/'); // Unescape forward slashes
const match = html.match(/(https?:\/\/[^\s"]+?(?:\.png|\.jpeg|\.jpg))/ig) || [];
const set = [...new Set(match)];
const filtered = set.filter(s => !s.includes('favicon') && !s.includes('PSXTROPHIES') && !s.includes('backgrounds') && !s.includes('trophy-ps5'));
console.log(filtered.slice(0, 15));
