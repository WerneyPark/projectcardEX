class PsxtExtractor extends BaseExtractor {
    async extractData(onProgress) {
        if (onProgress) onProgress("Lendo dados principais...");

        // --- PSN ID ---
        // 1. Tenta extrair da URL pathname: /WerneyPark/perfil -> WerneyPark
        let psnId = '';
        const pathParts = window.location.pathname.split('/').filter(Boolean);
        if (pathParts.length > 0 && !['rankings', 'jogos', 'guias', 'noticias'].includes(pathParts[0].toLowerCase())) {
            psnId = pathParts[0].trim();
        }

        // 2. Fallback via <title>
        if (!psnId) {
            const title = document.querySelector('title');
            const titleText = title ? (title.innerText || title.textContent || '') : '';
            psnId = titleText
                .replace(/^Perfil de\s*/i, '')
                .replace(/\s*\|\s*PSX\s*Trophies/i, '')
                .replace(/\s*\|\s*PSXTROPHIES/i, '')
                .trim();
        }

        // --- TROFÉUS ---
        const getTrophyCount = (trophyName) => {
            const trophiesSection = document.querySelector('section[class*="trophies"]');
            if (trophiesSection) {
                const trophySpans = trophiesSection.querySelectorAll('div > span');
                if (trophySpans.length >= 4) {
                    let text = '';
                    if (trophyName.includes('platinum')) text = trophySpans[0].textContent || trophySpans[0].innerText;
                    else if (trophyName.includes('gold')) text = trophySpans[1].textContent || trophySpans[1].innerText;
                    else if (trophyName.includes('silver')) text = trophySpans[2].textContent || trophySpans[2].innerText;
                    else if (trophyName.includes('bronze')) text = trophySpans[3].textContent || trophySpans[3].innerText;
                    return (text || '0').trim() || '0';
                }
            }
            return '0';
        };

        const plat = getTrophyCount('platinum');
        const gold = getTrophyCount('gold');
        const silver = getTrophyCount('silver');
        const bronze = getTrophyCount('bronze');

        // --- RANKINGS E PONTOS ---
        let rankingGeral = '0', rankingRegional = '0', rankingEstadual = '0';
        let pontosPH = '0', pontosPSN = '0', completudeGeral = '0', completudePlatina = '0';

        const spans = document.querySelectorAll('span');
        spans.forEach(span => {
            const text = (span.innerText || span.textContent || '').trim();
            if (!text) return;

            const nextEl = span.nextElementSibling;
            const nextText = nextEl ? (nextEl.innerText || nextEl.textContent || '').trim() : '';

            if (text === 'Geral') {
                if (nextEl && nextEl.tagName === 'H3') rankingGeral = nextText.replace('º', '').trim();
            } else if (text.startsWith('Regional')) {
                if (nextEl && nextEl.tagName === 'H3') rankingRegional = nextText.replace('º', '').trim();
            } else if (text.startsWith('Estadual')) {
                if (nextEl && nextEl.tagName === 'H3') rankingEstadual = nextText.replace('º', '').trim();
            } else if (text.includes('Pontos PH')) {
                if (nextEl && nextEl.tagName === 'H3') pontosPH = nextText;
            } else if (text.includes('Pontos PSN')) {
                if (nextEl && nextEl.tagName === 'H3') pontosPSN = nextText;
            } else if (text.includes('Completude Geral')) {
                if (nextEl && nextEl.tagName === 'H3') completudeGeral = nextText.replace('%', '').trim();
            } else if (text.includes('Completude Platina')) {
                if (nextEl && nextEl.tagName === 'H3') completudePlatina = nextText.replace('%', '').trim();
            }
        });

        // --- AVATAR ---
        const avatarMeta = document.querySelector('meta[property="og:image"]');
        const avatar = avatarMeta ? avatarMeta.content : '';

        // --- EXTRAS (Velocista, Pioneiro, Dicas, Likes) ---
        const getExtra = title => {
            const el = document.querySelector(`div[title="${title}"] span`);
            return el ? (el.innerText || el.textContent || '0').trim() || '0' : '0';
        };

        const velocista = getExtra('Velocista');
        const pioneiro = getExtra('Pioneiro');
        const dicas = getExtra('Dicas Postadas');
        const likes = getExtra('Total de curtidas em dicas');
        let horasJogadas = getExtra('Horas Jogadas') || getExtra('Horas jogadas') || getExtra('Total de horas jogadas') || getExtra('Total de Horas Jogadas') || getExtra('Horas');
        if (!horasJogadas || horasJogadas === '0') {
            const horasDiv = document.querySelector('div[title*="ora"] span, div[title*="ORA"] span');
            if (horasDiv) horasJogadas = (horasDiv.innerText || horasDiv.textContent || '0').trim();
        }

        // --- LEVEL ---
        let level = '0';
        const levelSpans = Array.from(document.querySelectorAll('span'));
        const levelSpan = levelSpans.find(span => {
            const txt = span.innerText || span.textContent || '';
            return txt.includes('Level');
        });
        if (levelSpan) {
            const txt = levelSpan.innerText || levelSpan.textContent || '';
            const match = txt.match(/Level\s*(\d+)/i);
            if (match) {
                level = match[1];
            }
        }

        // --- TROFÉUS POR DIA ---
        let trofeusPorDia = '0';
        const h2TrofeusDia = Array.from(document.querySelectorAll('h2')).find(el => {
            const txt = (el.innerText || el.textContent || '').trim();
            return txt === 'Troféus por dia' || txt.includes('Troféus por dia');
        });
        if (h2TrofeusDia) {
            const container = h2TrofeusDia.closest('div');
            if (container) {
                const h1 = container.querySelector('main div h1, div h1, h1');
                if (h1) trofeusPorDia = (h1.innerText || h1.textContent || '0').trim() || '0';
            }
        }

        // --- TOTAL DE JOGOS (Cálculo via Regra de Três) ---
        let totalJogos = '0';
        try {
            const platNum = parseInt((plat || '0').replace(/\./g, '').replace(/,/g, ''), 10) || 0;
            const complPlatNum = parseFloat((completudePlatina || '0').replace(',', '.'));
            
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
            if (onProgress) onProgress("Buscando estatísticas e badges...");
            try {
                const urlHist = `https://psxtrophies.com.br/${encodeURIComponent(psnId)}/historico?page=1&includes=PSVITA/PS3/PS4/PS5/PSPC/&trophyType=platinum&order=ph&direction=desc&rarity=all`;
                const histResp = await fetch(urlHist).catch(err => {
                    console.error('Erro de rede ao buscar platinas raras:', err);
                    return null;
                });
                if (histResp && histResp.ok) {
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
            psnId: psnId || 'jogador',
            level: level || '0',
            plat: plat || '0',
            gold: gold || '0',
            silver: silver || '0',
            bronze: bronze || '0',
            rankingGeral: rankingGeral || '0',
            rankingRegional: rankingRegional || '0',
            rankingEstadual: rankingEstadual || '0',
            pontosPH: pontosPH || '0',
            pontosPSN: pontosPSN || '0',
            completudeGeral: completudeGeral || '0',
            completudePlatina: completudePlatina || '0',
            avatar: avatar || '',
            velocista: velocista || '0',
            pioneiro: pioneiro || '0',
            dicas: dicas || '0',
            likes: likes || '0',
            horasJogadas: horasJogadas || '0',
            trofeusPorDia: trofeusPorDia || '0',
            totalJogos: totalJogos || '0',
            platinasRaras: Array.isArray(platinasRaras) ? platinasRaras : []
        };
    }
}
