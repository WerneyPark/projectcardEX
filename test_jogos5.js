const fs = require('fs');
let html = fs.readFileSync('scratch_fbanin_jogos.html', 'utf8');
const match = html.match(/self\.__next_f\.push\(\[(.*?)\]\)/g);
if (match) {
    const data = match.join('\n');
    const regex = /.{0,50}(?<!\d)(1[0-9]{2}|[2-9][0-9]{2}|[1-9][0-9]{3})(?!\d).{0,50}/g;
    let m;
    let count = 0;
    while ((m = regex.exec(data)) !== null && count < 30) {
        if (!m[0].includes('PNG') && !m[0].includes('width') && !m[0].includes('height') && !m[0].includes('playDuration')) {
            console.log(m[0].replace(/\n/g, ' '));
            count++;
        }
    }
}
