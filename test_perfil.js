const fs = require('fs');
let html = fs.readFileSync('scratch_perfil.html', 'utf8');
const match = html.match(/"total[A-Za-z]*"\s*:\s*\d+/ig);
console.log(match ? [...new Set(match)] : 'not found total');
const match2 = html.match(/"count"\s*:\s*\d+/ig);
console.log(match2 ? [...new Set(match2)] : 'not found count');
