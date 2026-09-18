/**
 * PsnpExtractor — Extrai dados do perfil do usuário no PSNProfiles (psnprofiles.com).
 *
 * O PSNProfiles é renderizado server-side (HTML estático) e acessível diretamente
 * via content script após o Cloudflare challenge ser resolvido pelo browser do usuário.
 *
 * URL de perfil: https://psnprofiles.com/{username}
 *
 * Seletores mapeados via análise do DOM do site (estrutura estável):
 * - PSN ID: <span class="username"> ou via <title>
 * - Avatar: img dentro de .avatar ou header do perfil
 * - Troféus: ul.profile-trophies > li[class*="platinum"|"gold"|"silver"|"bronze"]
 * - Level: div.level > span (ou div#bar-level)
 * - Completion: .completion-bar span
 * - Ranks: li.country-rank, li.world-rank
 * - Games Played: li.games-played
 */
class PsnpExtractor extends BaseExtractor {
    async extractData(onProgress) {
        if (onProgress) onProgress("Lendo dados principais...");

        // --- PSN ID ---
        let psnId = '';

        // Seletor primário: span.username dentro do header do perfil
        const usernameEl = document.querySelector('span.username, h1.username, .user-bar h1');
        if (usernameEl) {
            psnId = (usernameEl.textContent || '').trim();
        }

        // Fallback via <title>: "WerneyPark's Profile - PSNProfiles"
        if (!psnId) {
            const titleEl = document.querySelector('title');
            if (titleEl) {
                const m = titleEl.textContent.match(/^(.+?)'s\s+(?:Trophy\s+)?Profile/i);
                if (m) psnId = m[1].trim();
            }
        }

        // --- AVATAR ---
        let avatar = '';
        // Tenta meta og:image primeiro (mais confiável)
        const ogImg = document.querySelector('meta[property="og:image"]');
        if (ogImg) avatar = ogImg.content;

        if (!avatar) {
            // Fallback: img dentro do avatar container
            const avatarImg = document.querySelector('.avatar img, .sidebar-bottom img.avatar, #banner img.avatar');
            if (avatarImg) avatar = avatarImg.src;
        }

        // --- TROFÉUS ---
        // PSNProfiles estrutura: <li class="platinum"><span class="icon-sprite"></span> 173</li>
        const getTrophyValue = (typeClass) => {
            const el = document.querySelector(`#user-bar li.${typeClass}, ul.profile-bar li.${typeClass}, li.${typeClass}`);
            if (el) {
                const clone = el.cloneNode(true);
                const icons = clone.querySelectorAll('.icon-sprite, img, svg');
                icons.forEach(i => i.remove());
                const val = (clone.textContent || '').replace(/[^0-9]/g, '').trim();
                if (val) return val;
            }
            return '0';
        };

        const plat   = getTrophyValue('platinum');
        const gold   = getTrophyValue('gold');
        const silver = getTrophyValue('silver');
        const bronze = getTrophyValue('bronze');

        // --- LEVEL ---
        let level = '0';
        const levelEl = document.querySelector('.level-box .flex.vertical span, .level-box span, #user-bar .level-box span');
        if (levelEl) {
            const val = (levelEl.textContent || '').replace(/[^0-9]/g, '').trim();
            if (val) level = val;
        }

        // Fallback do level via meta tags
        if (level === '0') {
            const ogDesc = document.querySelector('meta[property="og:description"]');
            if (ogDesc && ogDesc.content) {
                const m = ogDesc.content.match(/Level\s+([0-9]+)/i);
                if (m) level = m[1];
            }
        }
        if (level === '0') {
            const metaDesc = document.querySelector('meta[name="Description"]');
            if (metaDesc && metaDesc.content) {
                const m = metaDesc.content.match(/Level\s+([0-9]+)/i);
                if (m) level = m[1];
            }
        }

        // --- ESTATÍSTICAS DA BARRA (.stats.flex) ---
        // No PSNProfiles: <span class="stat grow">516<span>Games Played</span></span>
        const statsMap = {};
        document.querySelectorAll('.stats .stat, .stats .rank, .stats .country-rank').forEach(el => {
            const labelEl = el.querySelector('span');
            if (labelEl) {
                const label = (labelEl.textContent || '').trim().toLowerCase();
                const clone = el.cloneNode(true);
                clone.querySelectorAll('span').forEach(s => s.remove());
                const val = (clone.textContent || '').trim();
                statsMap[label] = val;
            }
        });

        // Total de jogos (Games Played)
        let totalJogos = '0';
        if (statsMap['games played']) {
            totalJogos = statsMap['games played'].replace(/[^0-9]/g, '').trim() || '0';
        }

        // Completude Geral (Completion) — remove % para permitir formatação pelo Renderer
        let completudeGeral = '0';
        if (statsMap['completion']) {
            completudeGeral = statsMap['completion'].replace(/[^0-9.,]/g, '').trim() || '0';
        }

        // Troféus não conquistados (Unearned Trophies)
        let unearned = '0';
        if (statsMap['unearned trophies']) {
            unearned = statsMap['unearned trophies'].replace(/[^0-9]/g, '').trim() || '0';
        }

        // Troféus por dia (Trophies Per Day)
        let trofeusPorDia = '0';
        if (statsMap['trophies per day']) {
            trofeusPorDia = statsMap['trophies per day'].replace(/[^0-9.,]/g, '').trim() || '0';
        }

        // Ranking Mundial (World Rank)
        let rankingGeral = '0';
        if (statsMap['world rank']) {
            rankingGeral = statsMap['world rank'].replace(/[^0-9]/g, '').trim() || '0';
        }

        // Ranking Regional / País (Country Rank)
        let rankingRegional = '0';
        if (statsMap['country rank']) {
            rankingRegional = statsMap['country rank'].replace(/[^0-9]/g, '').trim() || '0';
        }

        // Fallback para estatísticas via meta Description caso não estejam no DOM
        if (rankingGeral === '0' || rankingRegional === '0' || totalJogos === '0') {
            const metaDesc = document.querySelector('meta[name="Description"]');
            if (metaDesc && metaDesc.content) {
                const desc = metaDesc.content;
                if (rankingGeral === '0') {
                    const m = desc.match(/World\s+Rank:\s*([0-9,]+)/i);
                    if (m) rankingGeral = m[1].replace(/[^0-9]/g, '');
                }
                if (rankingRegional === '0') {
                    const m = desc.match(/Country\s+Rank:\s*([0-9,]+)/i);
                    if (m) rankingRegional = m[1].replace(/[^0-9]/g, '');
                }
                if (totalJogos === '0') {
                    const m = desc.match(/([0-9,]+)\s+Games/i);
                    if (m) totalJogos = m[1].replace(/[^0-9]/g, '');
                }
            }
        }

        // --- RARITIES (Ultra Rare, Very Rare, Rare, Uncommon, Common) ---
        // PSNProfiles estrutura:
        // <a href="...rarity=ultra-rare..."><center><span class="typo-top">105</span><br /><span class="typo-bottom">Ultra Rare</span></center></a>
        let ur = '0', vr = '0', rr = '0', uc = '0', cm = '0';

        const rarityLinks = document.querySelectorAll('a[href*="rarity="]');
        rarityLinks.forEach(a => {
            const valEl = a.querySelector('.typo-top');
            const labelEl = a.querySelector('.typo-bottom');
            if (!valEl) return;
            const val = (valEl.textContent || '').replace(/[^0-9]/g, '').trim();
            if (!val) return;

            const href = (a.getAttribute('href') || '').toLowerCase();
            const label = labelEl ? (labelEl.textContent || '').trim().toLowerCase() : '';

            if (href.includes('rarity=ultra-rare') || label.includes('ultra rare')) {
                ur = val;
            } else if (href.includes('rarity=very-rare') || label.includes('very rare')) {
                vr = val;
            } else if (href.includes('rarity=rare') || label === 'rare') {
                rr = val;
            } else if (href.includes('rarity=uncommon') || label.includes('uncommon')) {
                uc = val;
            } else if (href.includes('rarity=common') || label.includes('common')) {
                cm = val;
            }
        });

        // Fallbacks adicionais caso a estrutura mude ligeiramente
        if (ur === '0') {
            const el = document.querySelector('a[href*="ultra-rare"] .typo-top, .ultra-rare-trophies, [data-rarity="ultra-rare"]');
            if (el) ur = (el.textContent || '').replace(/[^0-9]/g, '').trim() || '0';
        }
        if (vr === '0') {
            const el = document.querySelector('a[href*="very-rare"] .typo-top, .very-rare-trophies, [data-rarity="very-rare"]');
            if (el) vr = (el.textContent || '').replace(/[^0-9]/g, '').trim() || '0';
        }
        if (rr === '0') {
            const el = document.querySelector('a[href*="rarity=rare&"] .typo-top, a[href$="rarity=rare"] .typo-top, .rare-trophies, [data-rarity="rare"]');
            if (el) rr = (el.textContent || '').replace(/[^0-9]/g, '').trim() || '0';
        }
        if (uc === '0') {
            const el = document.querySelector('a[href*="uncommon"] .typo-top, .uncommon-trophies, [data-rarity="uncommon"]');
            if (el) uc = (el.textContent || '').replace(/[^0-9]/g, '').trim() || '0';
        }
        if (cm === '0') {
            const el = document.querySelector('a[href*="rarity=common"] .typo-top, .common-trophies, [data-rarity="common"]');
            if (el) cm = (el.textContent || '').replace(/[^0-9]/g, '').trim() || '0';
        }

        return {
            psnId,
            avatar,
            level,
            plat,
            gold,
            silver,
            bronze,
            completudeGeral,
            completudePlatina: '0',
            totalJogos,
            rankingGeral,
            rankingRegional,
            rankingEstadual: '0',
            // Novos campos PSNProfiles
            ur,
            vr,
            rr,
            uc,
            cm,
            unearned,
            trofeusPorDia,
            // Campos não disponíveis no PSNProfiles
            pontosPH: '0',
            pontosPSN: '0',
            platinasRaras: [],
            velocista: '0',
            pioneiro: '0',
            dicas: '0',
            likes: '0'
        };
    }
}

