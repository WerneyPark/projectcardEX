class PsxtExtractor extends BaseExtractor {
    async extractData() {
        const title = document.querySelector('title');
        const psnId = title ? title.innerText.replace("Perfil de ", "").replace(" | PSX Trophies", "").trim() : '';

        const getTrophyCount = (trophyName) => {
            const trophiesSection = document.querySelector('section[class*="trophies"]');
            if (trophiesSection) {
                const trophySpans = trophiesSection.querySelectorAll('div > span');
                if (trophySpans.length >= 4) {
                    if (trophyName.includes('platinum')) return trophySpans[0].textContent || trophySpans[0].innerText;
                    if (trophyName.includes('gold')) return trophySpans[1].textContent || trophySpans[1].innerText;
                    if (trophyName.includes('silver')) return trophySpans[2].textContent || trophySpans[2].innerText;
                    if (trophyName.includes('bronze')) return trophySpans[3].textContent || trophySpans[3].innerText;
                }
            }
            return '0';
        };

        const plat = getTrophyCount('platinum');
        const gold = getTrophyCount('gold');
        const silver = getTrophyCount('silver');
        const bronze = getTrophyCount('bronze');

        let rankingGeral = '0', rankingRegional = '0', rankingEstadual = '0';
        let pontosPH = '0', pontosPSN = '0', completudeGeral = '0', completudePlatina = '0';

        const spans = document.querySelectorAll('span');
        spans.forEach(span => {
            const text = span.innerText.trim();
            if (text === 'Geral') {
                const h3 = span.nextElementSibling;
                if (h3 && h3.tagName === 'H3') rankingGeral = h3.innerText.replace('º', '').trim();
            } else if (text.startsWith('Regional')) {
                const h3 = span.nextElementSibling;
                if (h3 && h3.tagName === 'H3') rankingRegional = h3.innerText.replace('º', '').trim();
            } else if (text.startsWith('Estadual')) {
                const h3 = span.nextElementSibling;
                if (h3 && h3.tagName === 'H3') rankingEstadual = h3.innerText.replace('º', '').trim();
            } else if (text.includes('Pontos PH')) {
                const h3 = span.nextElementSibling;
                if (h3 && h3.tagName === 'H3') pontosPH = h3.innerText.trim();
            } else if (text.includes('Pontos PSN')) {
                const h3 = span.nextElementSibling;
                if (h3 && h3.tagName === 'H3') pontosPSN = h3.innerText.trim();
            } else if (text.includes('Completude Geral')) {
                const h3 = span.nextElementSibling;
                if (h3 && h3.tagName === 'H3') completudeGeral = h3.innerText.replace('%', '').trim();
            } else if (text.includes('Completude Platina')) {
                const h3 = span.nextElementSibling;
                if (h3 && h3.tagName === 'H3') completudePlatina = h3.innerText.replace('%', '').trim();
            }
        });

        const avatarMeta = document.querySelector('meta[property="og:image"]');
        const avatar = avatarMeta ? avatarMeta.content : '';

        const getExtra = title => {
            const el = document.querySelector(`div[title="${title}"] span`);
            return el ? el.innerText.trim() : '0';
        };

        const velocista = getExtra('Velocista');
        const pioneiro = getExtra('Pioneiro');
        const dicas = getExtra('Dicas Postadas');
        const likes = getExtra('Total de curtidas em dicas');

        let level = '0';
        const levelSpans = Array.from(document.querySelectorAll('span'));
        const levelSpan = levelSpans.find(span => span.textContent && span.textContent.includes('Level'));
        if (levelSpan) {
            const match = levelSpan.textContent.match(/Level\s*(\d+)/);
            if (match) {
                level = match[1];
            }
        }

        // --- TROFÉUS POR DIA ---
        let trofeusPorDia = '0';
        const h2TrofeusDia = Array.from(document.querySelectorAll('h2')).find(el => el.textContent === 'Troféus por dia');
        if (h2TrofeusDia) {
            const container = h2TrofeusDia.closest('div');
            if (container) {
                const h1 = container.querySelector('main div h1');
                if (h1) trofeusPorDia = h1.textContent.trim();
            }
        }

        // --- TOTAL DE JOGOS (Cálculo via Regra de Três) ---
        let totalJogos = '0';
        try {
            const platNum = parseInt(plat.replace(/\./g, ''), 10) || 0;
            const complPlatNum = parseFloat(completudePlatina.replace(',', '.'));
            
            if (complPlatNum > 0) {
                totalJogos = Math.round((platNum * 100) / complPlatNum).toString();
            } else if (platNum === 0) {
                totalJogos = '0';
            }
        } catch (e) {
            console.error('Erro ao calcular total de jogos:', e);
        }

        // --- PLATINAS MAIS RARAS (Async) ---
        let platinasRaras = [];
        if (psnId) {
            try {
                const urlHist = `https://psxtrophies.com.br/${psnId}/historico?page=1&includes=PSVITA/PS3/PS4/PS5/PSPC/&trophyType=platinum&order=ph&direction=desc&rarity=all`;
                const histResp = await fetch(urlHist);
                if (histResp.ok) {
                    let histHtml = await histResp.text();
                    // O Next.js escapa barras em JSON (ex: https:\/\/...). Precisamos desescapar para o regex funcionar em qualquer CDN.
                    histHtml = histHtml.replace(/\\\//g, '/');
                    
                    // Regex agnóstico: pega qualquer imagem .png/.jpg/.jpeg
                    const imgRegex = /(https?:\/\/[^\s"]+?(?:\.png|\.jpeg|\.jpg))/ig;
                    const allMatches = histHtml.match(imgRegex) || [];
                    
                    const filtered = [...new Set(allMatches)].filter(url => 
                        !url.includes('favicon') && 
                        !url.includes('PSXTROPHIES') && 
                        !url.includes('trophy-ps5-platinum') &&
                        !url.includes('backgrounds')
                    );
                    
                    platinasRaras = filtered.slice(1, 5);
                }
            } catch (e) {
                console.error('Erro ao buscar platinas raras:', e);
            }
        }

        return {
            psnId: psnId,
            level: level, plat, gold, silver, bronze,
            rankingGeral, rankingRegional, rankingEstadual,
            pontosPH, pontosPSN, completudeGeral, completudePlatina, avatar,
            velocista, pioneiro, dicas, likes,
            trofeusPorDia: trofeusPorDia,
            totalJogos: totalJogos,
            platinasRaras: platinasRaras
        };
    }
}
