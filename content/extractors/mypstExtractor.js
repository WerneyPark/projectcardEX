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
    async extractData() {
        // --- PSN ID ---
        const titleEl = document.querySelector('title');
        const titleText = titleEl ? titleEl.innerText : '';
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

        // --- TOTAL DE JOGOS (Regra de Três via Completude Platina) ---
        // No MyPST não temos completude, mas temos jogos100 (jogos 100%).
        // Aqui usamos: totalJogos = plat * 100 / completudePlatina (se disponível).
        // Como não temos completudePlatina direto, usamos jogos100 como aproximação de "Batalhas".
        // O campo será preenchido com jogos100 (jogos com 100% de troféus obtidos).
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
            frase: '',
            // Campos não disponíveis no MyPST (mantidos como '0' para compatibilidade)
            pontosPH: '0',
            completudeGeral: '0',
            completudePlatina: '0',
            rankingRegional: '0',
            rankingEstadual: '0',
            trofeusPorDia: '0',
            platinasRaras: [],
            velocista: '0',
            pioneiro: '0',
            dicas: '0',
            likes: '0'
        };
    }
}
