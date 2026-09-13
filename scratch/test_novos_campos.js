const fs = require('fs');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

function parseStats() {
    const html = fs.readFileSync('fbanin_estatisticas_ajax.html', 'utf8');
    const dom = new JSDOM(html);
    const document = dom.window.document;
    
    // Percentual do 100% Total
    let percentual100 = '0%';
    const tds = Array.from(document.querySelectorAll('td.txt09'));
    const tdTotal = tds.find(td => (td.textContent || '').includes('100% Total'));
    if (tdTotal) {
        const tr = tdTotal.parentElement;
        const allTds = tr.querySelectorAll('td');
        if (allTds.length >= 6) {
            percentual100 = (allTds[5].textContent || '').trim();
        }
    }
    console.log("Percentual 100% Total:", percentual100);
}

function parsePerfil() {
    const html = fs.readFileSync('fbanin_perfil.html', 'utf8');
    const dom = new JSDOM(html);
    const document = dom.window.document;
    
    // Usuário desde
    let usuarioDesde = '';
    let usuarioNumero = '';
    const desdeSpan = Array.from(document.querySelectorAll('span.txt08')).find(s => {
        const prev = s.previousElementSibling;
        return prev && (prev.textContent || '').includes('DESDE');
    });
    if (desdeSpan) {
        const match = (desdeSpan.textContent || '').match(/(\d{2}\/\d{2}\/\d{4})\s*#(\d+)/);
        if (match) {
            usuarioDesde = match[1];
            usuarioNumero = match[2];
        } else {
             // as vezes o # numero ta no inner span title
             const t = desdeSpan.textContent;
             const dMatch = t.match(/(\d{2}\/\d{2}\/\d{4})/);
             if (dMatch) usuarioDesde = dMatch[1];
             const innerSpan = desdeSpan.querySelector('span');
             if (innerSpan) {
                 const nMatch = (innerSpan.textContent||'').match(/#(\d+)/);
                 if (nMatch) usuarioNumero = nMatch[1];
             }
        }
    }
    console.log("Usuário Desde:", usuarioDesde, "Número:", usuarioNumero);

    // Badges
    const badgeMap = {
        'Guias': 'iconCardao05Off',
        'Mensal': 'iconCardao03Off',
        'Semanal': 'iconCardao04Off',
        'Pioneiro': 'iconCardao06Off',
        'Velocista': 'iconCardao07Off',
        'Tartaruga': 'iconCardao11Off',
        'Total Badges': 'iconCardao09' // Total badges might not have 'Off'
    };
    
    const badges = {};
    const tdsImg = Array.from(document.querySelectorAll('img[src*="iconCardao"]'));
    for (const [badgeName, iconStr] of Object.entries(badgeMap)) {
        const img = tdsImg.find(img => img.src.includes(iconStr));
        if (img) {
            let tdImg = img.closest('td');
            if (tdImg && tdImg.parentElement) {
                const trImg = tdImg.parentElement;
                const colIndex = Array.from(trImg.children).indexOf(tdImg);
                
                const trNumbers = trImg.nextElementSibling;
                if (trNumbers) {
                    const tdNumber = trNumbers.children[colIndex];
                    if (tdNumber) {
                        badges[badgeName] = (tdNumber.textContent || '').trim();
                    }
                }
            }
        }
    }
    console.log("Badges:", badges);

    // Milestones - Primeira Platina
    let imgPrimeiraPlatina = '';
    let namePrimeiraPlatina = '';
    const tables = Array.from(document.querySelectorAll('table[title*="Primeira Platina"], table[title*="Primeira platina"]'));
    const tablePP = tables.find(t => (t.textContent||'').includes('Primeira Platina'));
    if (tablePP) {
        const img = tablePP.querySelector('img[src*="trophy"]');
        if (img) imgPrimeiraPlatina = img.src;
        // get game name - usually in a span inside a td
        // text is formatted as Nome: <name> Jogo: <game>
        const content = tablePP.textContent || '';
        const m = content.match(/Nome:\s*(.+?)\s*Jogo:/);
        if (m) namePrimeiraPlatina = m[1].trim();
    } else {
        // Find by td containing "Primeira Platina"
        const tds = Array.from(document.querySelectorAll('td.txt09'));
        const td = tds.find(t => t.textContent.trim() === 'Primeira Platina');
        if (td) {
            const t = td.closest('table');
            if (t) {
                const img = t.querySelector('img[src*="trophy"]');
                if (img) imgPrimeiraPlatina = img.src;
            }
        }
    }
    console.log("Primeira Platina IMG:", imgPrimeiraPlatina);
}

parseStats();
parsePerfil();
