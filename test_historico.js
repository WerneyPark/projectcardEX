const fs = require('fs');
const html = fs.readFileSync('scratch_historico.html', 'utf8');
const match = html.match(/<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/);
if (match) {
    const data = JSON.parse(match[1]);
    fs.writeFileSync('historico_data.json', JSON.stringify(data, null, 2));
    console.log("Salvo!");
} else {
    console.log("Não encontrou");
}
