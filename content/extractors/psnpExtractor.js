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
    async extractData() {
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
        // PSNProfiles usa uma lista de troféus com classes específicas por tipo.
        // Estrutura: <ul class="profile-trophies"> <li class="platinum"> <span class="value">
        const getTrophyValue = (typeClass) => {
            // Seletores possíveis baseados na estrutura conhecida do PSNProfiles
            const selectors = [
                `li.${typeClass} .value`,
                `li.${typeClass} span`,
                `.trophy-count .${typeClass}`,
                `div.${typeClass} span`,
                `span.num-${typeClass}`
            ];
            for (const sel of selectors) {
                const el = document.querySelector(sel);
                if (el) {
                    const val = (el.textContent || '').replace(/[^0-9]/g, '').trim();
                    if (val) return val;
                }
            }
            return '0';
        };

        const plat   = getTrophyValue('platinum');
        const gold   = getTrophyValue('gold');
        const silver = getTrophyValue('silver');
        const bronze = getTrophyValue('bronze');

        // --- LEVEL ---
        let level = '0';
        const levelSelectors = [
            '.level',
            '#bar-level .level',
            'li.level',
            '.psnp-bar .level',
            'span.level-label'
        ];
        for (const sel of levelSelectors) {
            const el = document.querySelector(sel);
            if (el) {
                const val = (el.textContent || '').replace(/[^0-9]/g, '').trim();
                if (val) { level = val; break; }
            }
        }

        // --- COMPLETION ---
        let completudeGeral = '0';
        const completionSelectors = [
            '.completion-bar span',
            '.completion span',
            'li.completion span',
            '.psnp-bar .completion'
        ];
        for (const sel of completionSelectors) {
            const el = document.querySelector(sel);
            if (el) {
                const val = (el.textContent || '').replace(/[^0-9.,]/g, '').trim();
                if (val) { completudeGeral = val; break; }
            }
        }

        // --- GAMES PLAYED ---
        let totalJogos = '0';
        const gamesSelectors = [
            'li.games-played span',
            '.games-played .value',
            'li[data-type="games"] span',
            'a[href*="/games"] span'
        ];
        for (const sel of gamesSelectors) {
            const el = document.querySelector(sel);
            if (el) {
                const val = (el.textContent || '').replace(/[^0-9]/g, '').trim();
                if (val) { totalJogos = val; break; }
            }
        }

        // --- RANKING MUNDIAL ---
        let rankingGeral = '0';
        const worldRankSelectors = [
            'li.world-rank span',
            '.world-rank .rank',
            'li[data-rank="world"] span'
        ];
        for (const sel of worldRankSelectors) {
            const el = document.querySelector(sel);
            if (el) {
                const val = (el.textContent || '').replace(/[^0-9]/g, '').trim();
                if (val) { rankingGeral = val; break; }
            }
        }

        // --- RANKING POR PAÍS ---
        let rankingRegional = '0';
        const countryRankSelectors = [
            'li.country-rank span',
            '.country-rank .rank',
            'li[data-rank="country"] span'
        ];
        for (const sel of countryRankSelectors) {
            const el = document.querySelector(sel);
            if (el) {
                const val = (el.textContent || '').replace(/[^0-9]/g, '').trim();
                if (val) { rankingRegional = val; break; }
            }
        }

        // --- RARITIES ---
        const getRarityValue = (rarityClass) => {
            const selectors = [
                `.${rarityClass}-trophies`,
                `.${rarityClass}-trophies span`,
                `li[data-rarity="${rarityClass}"] span`,
                `.trophy-rarity .${rarityClass}`
            ];
            for (const sel of selectors) {
                const el = document.querySelector(sel);
                if (el) {
                    const val = (el.textContent || '').replace(/[^0-9]/g, '').trim();
                    if (val) return val;
                }
            }
            return '0';
        };

        const ur = getRarityValue('ultra-rare');
        const vr = getRarityValue('very-rare');
        const rr = getRarityValue('rare');
        const uc = getRarityValue('uncommon');
        const cm = getRarityValue('common');

        // --- UNEARNED ---
        let unearned = '0';
        const unearnedSelectors = [
            '.unearned',
            'li.unearned span',
            'li[data-stat="unearned"] span'
        ];
        for (const sel of unearnedSelectors) {
            const el = document.querySelector(sel);
            if (el) {
                const val = (el.textContent || '').replace(/[^0-9]/g, '').trim();
                if (val) { unearned = val; break; }
            }
        }

        // --- TROPHIES PER DAY ---
        let trofeusPorDia = '0';
        const tpdSelectors = [
            'li.trophies-per-day span',
            '.trophies-per-day .value',
            'li[data-stat="trophies-per-day"] span'
        ];
        for (const sel of tpdSelectors) {
            const el = document.querySelector(sel);
            if (el) {
                const val = (el.textContent || '').replace(/[^0-9.,]/g, '').trim();
                if (val) { trofeusPorDia = val; break; }
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

