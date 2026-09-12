const fs = require('fs');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

// Ler o HTML do MyPST
const html = fs.readFileSync('scratch_mypst.html', 'utf8');
const dom = new JSDOM(html);
const document = dom.window.document;

// Mock da BaseExtractor para a classe não falhar
class BaseExtractor {
    extractData() { return {}; }
}

// O código do MyPST Extractor (versão atual)
class MypstExtractor extends BaseExtractor {
    async extractData() {
        let psnId = '';
        const titleEl = document.querySelector('title');
        if (titleEl) {
            const titleText = titleEl.textContent || '';
            const titleMatch = titleText.match(/myPSt\s*\|\s*(.+?)\s*-/i);
            if (titleMatch) psnId = titleMatch[1].trim();
        }

        let avatar = '';
        const avatarWrapper = document.querySelector('div[style*="fundo-avatar"]');
        if (avatarWrapper) {
            const avatarImg = avatarWrapper.querySelector('img');
            if (avatarImg) avatar = avatarImg.src;
        }
        if (!avatar) {
            const avatarMeta = document.querySelector('meta[property="og:image"]');
            if (avatarMeta) avatar = avatarMeta.content;
        }

        let plat = '0', gold = '0', silver = '0', bronze = '0', totalTrophies = '0', jogos100 = '0';
        const totalRow = document.querySelector('tr.txt09');
        if (totalRow) {
            const tds = totalRow.querySelectorAll('td');
            if (tds.length >= 7) {
                plat         = (tds[1].textContent || '').trim() || '0';
                gold         = (tds[2].textContent || '').trim() || '0';
                silver       = (tds[3].textContent || '').trim() || '0';
                bronze       = (tds[4].textContent || '').trim() || '0';
                totalTrophies = (tds[5].textContent || '').trim() || '0';
                jogos100     = (tds[6].textContent || '').trim() || '0';
            }
        }

        let level = '0';
        const levelSpan = document.querySelector('span.txt08');
        if (levelSpan) level = (levelSpan.textContent || '').trim();

        let pontosPSN = '0';
        const pontosSpans = Array.from(document.querySelectorAll('span.txt09'));
        const pontosSpan = pontosSpans.find(s => (s.textContent || '').includes('Pontos'));
        if (pontosSpan) {
            const m = pontosSpan.textContent.match(/([\d.,]+)\s*Pontos/i);
            if (m) pontosPSN = m[1].trim();
        }

        let sumJogos = 0;
        const platRows = document.querySelectorAll('tr.txt19');
        platRows.forEach(row => {
            const tds = row.querySelectorAll('td');
            if (tds.length >= 2) {
                const val = parseInt((tds[1].textContent || '').replace(/[.,]/g, ''), 10);
                if (!isNaN(val)) sumJogos += val;
            }
        });
        const totalJogos = sumJogos > 0 ? sumJogos.toString() : jogos100;

        return {
            psnId,
            avatar,
            level,
            plat,
            gold,
            silver,
            bronze,
            totalTrophies,
            jogosCompletos: jogos100,
            jogos100,
            totalJogos,
            pontosPSN,
            mensal: '0',
            semanal: '0',
            guias: '0',
            tartaruga: '0',
            pdm: '0',
            rankingGeral: '0',
            rankingDificuldade: '0',
            frase: ''
        };
    }
}

async function run() {
    const ext = new MypstExtractor();
    const data = await ext.extractData();
    console.log(JSON.stringify(data, null, 2));
}

run();
