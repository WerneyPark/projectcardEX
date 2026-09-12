const fs = require('fs');
let html = fs.readFileSync('scratch_fbanin_jogos.html', 'utf8');
const match = html.match(/self\.__next_f\.push\(\[(.*?)\]\)/g);
if (match) {
    fs.writeFileSync('next_f.json', match.join('\n'));
}
