/**
 * MypstExtractor — Extrai dados do perfil do usuário no site MyPST (mypst.com.br).
 *
 * O MyPST é um site clássico com HTML estático + jQuery. O conteúdo de perfil
 * é carregado via AJAX após o onload, por isso o entry script usa setInterval
 * para aguardar a hidratação do DOM antes de injetar a UI.
 *
 * URL de perfil: https://mypst.com.br/rank/{username}/#!perfil
 */
class MypstExtractor extends BaseExtractor {
    async extractData(onProgress) {
        if (onProgress) onProgress("Lendo dados principais...");

        // --- PSN ID ---
        const titleEl = document.querySelector('title');
        const titleText = titleEl ? (titleEl.innerText || titleEl.textContent || '') : '';
        // Formato: "myPSt | Username - Perfil"
        let psnId = '';
        const titleMatch = titleText.match(/myPSt\s*\|\s*(.+?)\s*-/i);
        if (titleMatch) psnId = titleMatch[1].trim();

        // --- AVATAR ---
        // O avatar fica dentro da div com background fundo-avatar.jpg
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
        // A tabela possui rows por plataforma (txt19) e o total na row txt09.
        // Colunas: [plataforma, Plat, Gold, Silver, Bronze, Total, 100%]
        let plat = '0', gold = '0', silver = '0', bronze = '0', totalTrophies = '0', jogos100 = '0';

        const totalRow = document.querySelector('tr.txt09');
        if (totalRow) {
            const tds = totalRow.querySelectorAll('td');
            // tds[0] vazio, tds[1]=Plat, tds[2]=Gold, tds[3]=Silver, tds[4]=Bronze, tds[5]=Total, tds[6]=100%
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
        // Level fica em <span class="txt08"> após a img starlevel.png
        const levelSpan = document.querySelector('span.txt08');
        if (levelSpan) level = (levelSpan.textContent || '').trim();

        // --- PONTOS PSN ---
        let pontosPSN = '0';
        // Formato: "624,585 Pontos" dentro de span.txt09
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

        // --- FETCH DADOS EXTRAS VIA AJAX (Badges, Primeira Platina, 100% Total, Rankings, PDM) ---
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
                // Dispara os fetches de perfil, estatísticas e PDM em paralelo
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

                // 1. Parsing da Aba Perfil (Milestones, Join Date, Badges, Rankings)
                if (perfilHtml) {
                    const doc = new DOMParser().parseFromString(perfilHtml, 'text/html');

                    // Usuário Desde
                    const desdeSpan = Array.from(doc.querySelectorAll('span.txt08')).find(s => {
                        const prev = s.previousElementSibling;
                        return prev && (prev.textContent || '').includes('DESDE');
                    });
                    if (desdeSpan) {
                        const match = (desdeSpan.textContent || '').match(/(\d{2}\/\d{2}\/\d{4})\s*#(\d+)/);
                        if (match) {
                            usuarioDesde = match[1];
                            usuarioNumero = match[2];
                        } else {
                            const dMatch = desdeSpan.textContent.match(/(\d{2}\/\d{2}\/\d{4})/);
                            if (dMatch) usuarioDesde = dMatch[1];
                            const innerSpan = desdeSpan.querySelector('span');
                            if (innerSpan) {
                                const nMatch = (innerSpan.textContent || '').match(/#(\d+)/);
                                if (nMatch) usuarioNumero = nMatch[1];
                            }
                        }
                    }

                    // Badges (baseado no src da imagem para não depender da ordem exata)
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

                    // Rankings: Geral e Dificuldade
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

                // 2. Parsing da Aba Estatísticas (Eficácia 100% Total e Total de Jogos)
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

                // 3. Parsing do PDM (Ranking de Dificuldade)
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
            // Campos não disponíveis no MyPST (mantidos como '0' para compatibilidade)
            pontosPH: '0',
            completudeGeral: percentual100, // Preenche a completude geral também
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
