/**
 * MypstExtractor — Extrai dados do perfil do usuário no site MyPST (mypst.com.br / beta.mypst.com.br).
 *
 * Suporta dois modos de operação:
 * 1. SPA / Novo site (beta.mypst.com.br e futura produção):
 *    - Single Page Application (Vue 3).
 *    - Extrai dados diretamente das APIs REST nativas:
 *      - /api/v2/users/{username}/profile?max_regs=16
 *      - /api/users/{username}/stats/
 * 2. Site Clássico / Legado (mypst.com.br):
 *    - HTML estático + jQuery com carregamento AJAX das abas de perfil e estatísticas.
 */
class MypstExtractor extends BaseExtractor {
    async extractData(onProgress) {
        const isSpa = typeof document !== 'undefined' && (
            !!document.getElementById('app') ||
            (typeof window !== 'undefined' && window.location.hostname.startsWith('beta.')) ||
            !document.querySelector('#menu')
        );

        if (isSpa) {
            return this.extractFromSpa(onProgress);
        }
        return this.extractFromLegacy(onProgress);
    }

    /**
     * Extração para o novo MyPST (SPA / Vue 3 / REST API).
     */
    async extractFromSpa(onProgress) {
        if (onProgress) onProgress("Identificando perfil no MyPST...");

        const RESERVED = new Set([
            'jogos', 'ranking', 'hall', 'badges', 'guias', 'boosts', 'boost', 
            'faq', 'forum', 'myplus', 'mymyplus', 'login', 'cadastro', 
            'painel', 'stats', 'recuperar-senha', 'redefinir-senha', 'central-de-ban', 'central_de_ban'
        ]);

        let psnId = '';
        if (typeof window !== 'undefined' && window.location) {
            const pathSegments = window.location.pathname.split('/').filter(Boolean);
            if (pathSegments.length > 0 && !RESERVED.has(pathSegments[0].toLowerCase())) {
                psnId = pathSegments[0];
            }
        }

        if (!psnId && typeof document !== 'undefined') {
            const h2 = document.querySelector('h2');
            if (h2 && h2.textContent) {
                psnId = h2.textContent.trim();
            }
        }

        if (!psnId && typeof document !== 'undefined') {
            const titleEl = document.querySelector('title');
            const titleText = titleEl ? (titleEl.innerText || titleEl.textContent || '') : '';
            const m = titleText.match(/myPSt\s*\|\s*(?:Perfil de\s*)?([^\s\-]+)/i);
            if (m) psnId = m[1].trim();
        }

        if (!psnId) {
            console.warn("MyPST SPA: PSN ID não identificado, tentando modo legado...");
            return this.extractFromLegacy(onProgress);
        }

        if (onProgress) onProgress("Buscando dados da API MyPST...");

        try {
            const [profileRes, statsRes] = await Promise.all([
                fetch(`/api/v2/users/${encodeURIComponent(psnId)}/profile?max_regs=16`)
                    .then(r => r.ok ? r.json() : null)
                    .catch(err => {
                        console.error("Erro ao buscar /api/v2/users profile:", err);
                        return null;
                    }),
                fetch(`/api/users/${encodeURIComponent(psnId)}/stats/`)
                    .then(r => r.ok ? r.json() : null)
                    .catch(err => {
                        console.error("Erro ao buscar /api/users stats:", err);
                        return null;
                    })
            ]);

            if (!profileRes && !statsRes) {
                console.warn("MyPST SPA APIs falharam, tentando modo legado...");
                return this.extractFromLegacy(onProgress);
            }

            const actualPsnId = profileRes?.psn_id || psnId;
            const avatar = profileRes?.avatar || '';
            const frase = profileRes?.frase || '';
            const usuarioDesde = profileRes?.date_joined || '';
            const usuarioNumero = ''; // Omitido na nova arquitetura do MyPST

            const allPlat = profileRes?.platforms?.all || {};
            const level = String(allPlat.level ?? '0');
            const plat = String(allPlat.platinum ?? '0');
            const gold = String(allPlat.gold ?? '0');
            const silver = String(allPlat.silver ?? '0');
            const bronze = String(allPlat.bronze ?? '0');
            const totalTrophies = String(allPlat.total ?? profileRes?.have_all_my_trophies ?? '0');
            const pontosPSN = String(allPlat.points ?? '0');
            const pdm = String(Math.round(Number(allPlat.pdm ?? 0)) || '0');

            const totalJogos = String(profileRes?.all_games_100 ?? statsRes?.all_games_100 ?? '0');
            const jogos100 = String(statsRes?.my_all_games_100 ?? '0');
            const jogosCompletos = jogos100;
            const percentual100 = statsRes?.perc_all_games_100 != null
                ? `${statsRes.perc_all_games_100}%`
                : (profileRes?.perc_all_my_trophies != null ? `${profileRes.perc_all_my_trophies}%` : '0%');

            const counters = profileRes?.counters || {};
            const mensal = String(counters.mensal ?? statsRes?.num_vezes_lider_mensal ?? '0');
            const semanal = String(counters.semanal ?? statsRes?.num_vezes_lider_semanal ?? '0');
            const guias = String(counters.guide ?? statsRes?.guide_count ?? '0');
            const pioneiro = String(counters.pion ?? statsRes?.pion_count ?? '0');
            const velocista = String(counters.veloc ?? statsRes?.veloc_count ?? '0');
            const tartaruga = String(counters.tart ?? statsRes?.tart_count ?? '0');
            const totalBadges = String(counters.badges ?? '0');

            let imgPrimeiraPlatina = '';
            if (Array.isArray(profileRes?.milestones)) {
                const pp = profileRes.milestones.find(m => m && m.tipo === 'Primeira Platina');
                if (pp?.info) {
                    imgPrimeiraPlatina = pp.info.trophy_img_full || pp.info.trophy_img || '';
                }
            }

            let rankingGeral = '0';
            let rankingDificuldade = '0';
            if (Array.isArray(profileRes?.rank)) {
                const rGeral = profileRes.rank.find(r => r && r.type === 'GERAL' && r.pf === 'all');
                if (rGeral && rGeral.rank) rankingGeral = String(rGeral.rank);
                const rDif = profileRes.rank.find(r => r && r.type === 'DIFICULDADE' && r.pf === 'all');
                if (rDif && rDif.rank) rankingDificuldade = String(rDif.rank);
            }

            return {
                psnId: actualPsnId,
                avatar,
                level,
                plat,
                gold,
                silver,
                bronze,
                totalTrophies,
                jogosCompletos,
                jogos100,
                totalJogos,
                pontosPSN,
                mensal,
                semanal,
                guias,
                tartaruga,
                velocista,
                pioneiro,
                totalBadges,
                percentual100,
                usuarioDesde,
                usuarioNumero,
                pdm,
                rankingGeral,
                rankingDificuldade,
                frase,
                pontosPH: '0',
                completudeGeral: percentual100,
                completudePlatina: '0',
                rankingRegional: '0',
                rankingEstadual: '0',
                trofeusPorDia: '0',
                platinasRaras: imgPrimeiraPlatina ? [imgPrimeiraPlatina] : [],
                dicas: String(counters.tip ?? statsRes?.tip_count ?? '0'),
                likes: String(counters.curtir ?? statsRes?.curtir_count ?? '0')
            };
        } catch (e) {
            console.error("Erro na extração MyPST SPA:", e);
            return this.extractFromLegacy(onProgress);
        }
    }

    /**
     * Extração legado para o site clássico do MyPST (mypst.com.br).
     */
    async extractFromLegacy(onProgress) {
        if (onProgress) onProgress("Lendo dados principais (modo clássico)...");

        // --- PSN ID ---
        const titleEl = document.querySelector('title');
        const titleText = titleEl ? (titleEl.innerText || titleEl.textContent || '') : '';
        // Formato: "myPSt | Username - Perfil"
        let psnId = '';
        const titleMatch = titleText.match(/myPSt\s*\|\s*(.+?)\s*-/i);
        if (titleMatch) psnId = titleMatch[1].trim();

        // --- AVATAR ---
        let avatar = '';
        const avatarWrapper = document.querySelector('div[style*="fundo-avatar"]');
        if (avatarWrapper) {
            const avatarImg = avatarWrapper.querySelector('img');
            if (avatarImg) avatar = avatarImg.src;
        }
        // Fallback: og:image
        if (!avatar) {
            const avatarMeta = document.querySelector('meta[property="og:image"]');
            if (avatarMeta) avatar = avatarMeta.content;
        }

        // --- TROFÉUS ---
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

        // --- LEVEL ---
        let level = '0';
        const levelSpan = document.querySelector('span.txt08');
        if (levelSpan) level = (levelSpan.textContent || '').trim();

        // --- PONTOS PSN ---
        let pontosPSN = '0';
        const pontosSpans = Array.from(document.querySelectorAll('span.txt09'));
        const pontosSpan = pontosSpans.find(s => (s.textContent || '').includes('Pontos'));
        if (pontosSpan) {
            const m = pontosSpan.textContent.match(/([\d.,]+)\s*Pontos/i);
            if (m) pontosPSN = m[1].trim();
        }

        // --- FRASE DE PERFIL ---
        let frase = '';
        const fraseEl = document.querySelector('.frase_user_header');
        if (fraseEl) {
            frase = (fraseEl.textContent || '').trim();
        }

        // --- TOTAL DE JOGOS (Fallback inicial antes das estatísticas) ---
        let sumJogos = 0;
        const platRows = document.querySelectorAll('tr.txt19');
        platRows.forEach(row => {
            const tds = row.querySelectorAll('td');
            if (tds.length >= 2) {
                const val = parseInt((tds[1].textContent || '').replace(/[.,]/g, ''), 10);
                if (!isNaN(val)) sumJogos += val;
            }
        });
        let totalJogos = sumJogos > 0 ? sumJogos.toString() : jogos100;

        // --- FETCH DADOS EXTRAS VIA AJAX ---
        let percentual100 = '0%';
        let usuarioDesde = '';
        let usuarioNumero = '';
        let imgPrimeiraPlatina = '';
        let rankingGeral = '0';
        let rankingDificuldade = '0';
        let pdm = '0';
        let badgesMap = {
            'Guias': '0', 'Mensal': '0', 'Semanal': '0', 'Pioneiro': '0',
            'Velocista': '0', 'Tartaruga': '0', 'Total Badges': '0'
        };

        if (psnId) {
            if (onProgress) onProgress("Buscando estatísticas, rankings e PDM...");
            try {
                const [perfilHtml, statsHtml, pdmHtml] = await Promise.all([
                    fetch(`/rank/${psnId}/perfil/`, {
                        headers: { 'X-Requested-With': 'XMLHttpRequest' }
                    }).then(async res => res.ok ? await res.text() : null).catch(err => {
                        console.error("Erro ao buscar perfil MyPST:", err);
                        return null;
                    }),
                    fetch(`/rank/${psnId}/estatisticas/`, {
                        headers: { 'X-Requested-With': 'XMLHttpRequest' }
                    }).then(async res => res.ok ? await res.text() : null).catch(err => {
                        console.error("Erro ao buscar estatísticas MyPST:", err);
                        return null;
                    }),
                    fetch(`/new_rank/?type=DIFICULDADE&busca=${encodeURIComponent(psnId)}&R=brasil&t=all`, {
                        headers: { 'X-Requested-With': 'XMLHttpRequest' }
                    }).then(async res => res.ok ? await res.text() : null).catch(err => {
                        console.error("Erro ao buscar PDM MyPST:", err);
                        return null;
                    })
                ]);

                // 1. Parsing da Aba Perfil
                if (perfilHtml) {
                    const doc = new DOMParser().parseFromString(perfilHtml, 'text/html');

                    // Usuário Desde
                    const desdeSpan = Array.from(doc.querySelectorAll('span.txt08')).find(s => {
                        const prev = s.previousElementSibling;
                        return prev && (prev.textContent || '').includes('DESDE');
                    });
                    if (desdeSpan) {
                        const match = (desdeSpan.textContent || '').match(/(\d{2}\/\d{2}\/\d{4})\s*#(\d+[\d.]*)/);
                        if (match) {
                            usuarioDesde = match[1];
                            usuarioNumero = match[2];
                        } else {
                            const dMatch = desdeSpan.textContent.match(/(\d{2}\/\d{2}\/\d{4})/);
                            if (dMatch) usuarioDesde = dMatch[1];
                            const innerSpan = desdeSpan.querySelector('span');
                            if (innerSpan) {
                                const nMatch = (innerSpan.textContent || '').match(/#(\d+[\d.]*)/);
                                if (nMatch) usuarioNumero = nMatch[1];
                            }
                        }
                    }

                    // Badges
                    const bMap = {
                        'Guias': 'iconCardao05',
                        'Mensal': 'iconCardao03',
                        'Semanal': 'iconCardao04',
                        'Pioneiro': 'iconCardao06',
                        'Velocista': 'iconCardao07',
                        'Tartaruga': 'iconCardao11',
                        'Total Badges': 'iconCardao09'
                    };
                    const tdsImg = Array.from(doc.querySelectorAll('img[src*="iconCardao"]'));
                    for (const [bName, iconStr] of Object.entries(bMap)) {
                        const img = tdsImg.find(img => img.src.includes(iconStr));
                        if (img) {
                            const tdImg = img.closest('td');
                            if (tdImg && tdImg.parentElement) {
                                const trImg = tdImg.parentElement;
                                const colIndex = Array.from(trImg.children).indexOf(tdImg);
                                const trNumbers = trImg.nextElementSibling;
                                if (trNumbers) {
                                    const tdNumber = trNumbers.children[colIndex];
                                    if (tdNumber) {
                                        badgesMap[bName] = (tdNumber.textContent || '').replace(/[^\d]/g, '').trim() || '0';
                                    }
                                }
                            }
                        }
                    }

                    // Milestone: Primeira Platina
                    const tables = Array.from(doc.querySelectorAll('table[title*="Primeira Platina"], table[title*="Primeira platina"]'));
                    const tablePP = tables.find(t => (t.textContent || '').includes('Primeira Platina'));
                    if (tablePP) {
                        const img = tablePP.querySelector('img[src*="trophy"]');
                        if (img) imgPrimeiraPlatina = img.src;
                    } else {
                        const tds = Array.from(doc.querySelectorAll('td.txt09'));
                        const td = tds.find(t => t.textContent.trim() === 'Primeira Platina');
                        if (td) {
                            const t = td.closest('table');
                            if (t) {
                                const img = t.querySelector('img[src*="trophy"]');
                                if (img) imgPrimeiraPlatina = img.src;
                            }
                        }
                    }

                    // Rankings
                    const aGeral = Array.from(doc.querySelectorAll('a.lnk02')).find(a => {
                        const txt = a.textContent || '';
                        const href = a.getAttribute('href') || '';
                        return txt.includes('RANKING GERAL') && (href.includes('t:all') || !href.includes('t:'));
                    });
                    if (aGeral) {
                        const trGeral = aGeral.closest('tr');
                        if (trGeral) {
                            const tds = trGeral.querySelectorAll('td');
                            if (tds.length >= 4) {
                                rankingGeral = (tds[3].textContent || '').replace(/[^\d]/g, '').trim() || '0';
                            }
                        }
                    }

                    const aDif = Array.from(doc.querySelectorAll('a.lnk02')).find(a => {
                        const txt = a.textContent || '';
                        const href = a.getAttribute('href') || '';
                        return txt.includes('RANKING DIFICULDADE') && (href.includes('t:all') || !href.includes('t:'));
                    });
                    if (aDif) {
                        const trDif = aDif.closest('tr');
                        if (trDif) {
                            const tds = trDif.querySelectorAll('td');
                            if (tds.length >= 4) {
                                rankingDificuldade = (tds[3].textContent || '').replace(/[^\d]/g, '').trim() || '0';
                            }
                        }
                    }
                }

                // 2. Parsing da Aba Estatísticas
                if (statsHtml) {
                    const doc = new DOMParser().parseFromString(statsHtml, 'text/html');
                    const tds = Array.from(doc.querySelectorAll('td.txt09'));
                    const tdTotal = tds.find(td => (td.textContent || '').includes('100% Total'));
                    if (tdTotal) {
                        const tr = tdTotal.parentElement;
                        const allTds = tr.querySelectorAll('td');
                        if (allTds.length >= 2) {
                            const tVal = (allTds[1].textContent || '').replace(/[^\d]/g, '').trim();
                            if (tVal) totalJogos = tVal;
                        }
                        if (allTds.length >= 6) {
                            percentual100 = (allTds[5].textContent || '').trim();
                        }
                    }
                }

                // 3. Parsing do PDM
                if (pdmHtml) {
                    const doc = new DOMParser().parseFromString(pdmHtml, 'text/html');
                    const links = Array.from(doc.querySelectorAll('a.link_txt_rank'));
                    const userLink = links.find(a => {
                        const txt = a.textContent.trim().toLowerCase();
                        const href = (a.getAttribute('href') || '').toLowerCase();
                        return txt === psnId.toLowerCase() || href === `/rank/${psnId.toLowerCase()}` || href === `/rank/${psnId.toLowerCase()}/`;
                    });
                    if (userLink) {
                        const row = userLink.closest('.my_hover') || userLink.closest('.txt_rank');
                        if (row) {
                            const cols = Array.from(row.querySelectorAll('.coluna'));
                            if (cols.length >= 20) {
                                pdm = (cols[19].textContent || '').trim();
                            }
                            if (rankingDificuldade === '0' && cols.length >= 2) {
                                const rd = (cols[1].textContent || '').replace(/[^\d]/g, '').trim();
                                if (rd) rankingDificuldade = rd;
                            }
                        }
                    }
                }
            } catch (e) {
                console.error("Erro ao buscar dados AJAX extras:", e);
            }
        }

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
            mensal: badgesMap['Mensal'],
            semanal: badgesMap['Semanal'],
            guias: badgesMap['Guias'],
            tartaruga: badgesMap['Tartaruga'],
            velocista: badgesMap['Velocista'],
            pioneiro: badgesMap['Pioneiro'],
            totalBadges: badgesMap['Total Badges'],
            percentual100,
            usuarioDesde,
            usuarioNumero,
            pdm,
            rankingGeral,
            rankingDificuldade,
            frase,
            pontosPH: '0',
            completudeGeral: percentual100,
            completudePlatina: '0',
            rankingRegional: '0',
            rankingEstadual: '0',
            trofeusPorDia: '0',
            platinasRaras: imgPrimeiraPlatina ? [imgPrimeiraPlatina] : [],
            dicas: '0',
            likes: '0'
        };
    }
}

if (typeof globalThis !== 'undefined') {
    globalThis.MypstExtractor = MypstExtractor;
}
if (typeof window !== 'undefined') {
    window.MypstExtractor = MypstExtractor;
}
