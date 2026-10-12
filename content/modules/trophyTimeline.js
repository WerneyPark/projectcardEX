/**
 * trophyTimeline.js — Módulo de Contagem de Tempo e Linha do Tempo de Troféus para PSX Trophies.
 * 
 * Injeta em tempo real nas páginas de jogos de usuários (/:username/jogo/:gameSlug):
 * 1. Tempo total decorrido desde o primeiro troféu conquistado do jogo (T_0).
 * 2. Diferença (split) em relação ao troféu imediatamente anterior (+...).
 * 3. Indicação especial para o primeiro troféu conquistado.
 */

class PsxtTrophyTimeline {
    constructor(options = {}) {
        this.lang = options.lang || 'pt';
        this.isRunning = false;
        this.observer = null;
        this.lastUrl = '';
    }

    /**
     * Verifica se a página atual é uma página de troféus de um usuário para um jogo específico.
     * Exemplo: /WerneyPark/jogo/08256-sword-art-online-lost-song
     * @returns {boolean}
     */
    isUserGamePage() {
        if (typeof window === 'undefined' || !window.location) return false;
        const pathParts = window.location.pathname.split('/').filter(Boolean);

        // Deve ter pelo menos 2 segmentos, segundo segmento deve ser 'jogo'
        // Primeiro segmento não pode ser rota global ('jogo', 'jogos', 'rankings', etc.)
        // Quarto segmento não pode ser 'trofeu' (página individual de troféu)
        const reservedRoots = ['jogo', 'jogos', 'ranking', 'rankings', 'guias', 'noticias', 'feed', 'membros', 'faq', 'insignias'];
        if (pathParts.length < 2) return false;
        if (reservedRoots.includes(pathParts[0].toLowerCase())) return false;
        if (pathParts[1].toLowerCase() !== 'jogo') return false;
        if (pathParts[3] && pathParts[3].toLowerCase() === 'trofeu') return false;

        return true;
    }

    /**
     * Extrai os dados de data/hora de um item de troféu (<li>).
     * @param {HTMLElement} liElement
     * @returns {{date: Date, timestamp: number, dateSpan: HTMLElement, dateSection: HTMLElement}|null}
     */
    extractTrophyDate(liElement) {
        if (!liElement) return null;
        const aside = liElement.querySelector('aside');
        if (!aside) return null;

        const spans = aside.querySelectorAll('span');
        for (const span of spans) {
            // Limpa tags HTML (como <br>) substituindo por espaço para máxima robustez
            const rawHtml = span.innerHTML || '';
            const cleanText = rawHtml.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
            const fallbackText = (span.innerText || span.textContent || '').trim();
            const textToParse = cleanText || fallbackText;

            if (!textToParse.includes('/')) continue;

            const date = typeof Formatters !== 'undefined' && typeof Formatters.parseTrophyDate === 'function'
                ? Formatters.parseTrophyDate(textToParse)
                : null;

            if (date) {
                const dateSection = span.closest('section') || span.parentElement;
                return {
                    date,
                    timestamp: date.getTime(),
                    dateSpan: span,
                    dateSection
                };
            }
        }

        return null;
    }

    /**
     * Processa um container de troféus (Desktop ou Mobile).
     * @param {HTMLElement[]} trophyItems Lista de elementos <li> do container
     */
    processContainer(trophyItems) {
        if (!Array.isArray(trophyItems) || trophyItems.length === 0) return;

        // Extrai dados dos troféus conquistados
        const earnedList = [];
        for (let idx = 0; idx < trophyItems.length; idx++) {
            const li = trophyItems[idx];
            const dateData = this.extractTrophyDate(li);
            if (dateData) {
                earnedList.push({
                    li,
                    domIndex: idx,
                    ...dateData
                });
            } else {
                // Remove qualquer timeline residual caso o troféu não esteja conquistado
                const existing = li.querySelector('.projectcardex-trophy-timeline');
                if (existing) existing.remove();
                delete li.dataset.pcexTimeSignature;
            }
        }

        if (earnedList.length === 0) return;

        // Ordena cronologicamente por timestamp (o mais antigo é T_0 na posição 0).
        // Em caso de empate no mesmo segundo, o troféu posicionado mais abaixo no DOM (maior domIndex)
        // é considerado conquistado primeiro, respeitando a leitura cronológica de baixo para cima do site.
        earnedList.sort((a, b) => {
            if (a.timestamp !== b.timestamp) {
                return a.timestamp - b.timestamp;
            }
            return b.domIndex - a.domIndex;
        });

        const firstTrophy = earnedList[0];

        // Itera sobre os troféus ordenados e calcula as durações
        for (let i = 0; i < earnedList.length; i++) {
            const current = earnedList[i];
            const isFirst = (i === 0);

            let signature = '';
            let totalFormatted = '';
            let diffFormatted = '';

            if (isFirst) {
                signature = 'first';
            } else {
                const prev = earnedList[i - 1];
                const secTotal = Math.max(0, Math.round((current.timestamp - firstTrophy.timestamp) / 1000));
                const secDiff = Math.max(0, Math.round((current.timestamp - prev.timestamp) / 1000));

                totalFormatted = Formatters.formatTrophyDuration(secTotal, this.lang);
                diffFormatted = Formatters.formatTrophyDuration(secDiff, this.lang);
                signature = `${secTotal}_${secDiff}_${this.lang}`;
            }

            // Se o item já possui o badge com o mesmo valor calculado, ignora para evitar reflows
            if (current.li.dataset.pcexTimeSignature === signature) {
                continue;
            }

            // Injeta ou atualiza o elemento visual
            this.injectBadge(current, isFirst, totalFormatted, diffFormatted, signature);
        }
    }

    /**
     * Injeta ou atualiza o elemento visual do badge de tempo no corpo do troféu (dentro de <article>, abaixo da descrição).
     */
    injectBadge(trophyData, isFirst, totalFormatted, diffFormatted, signature) {
        const { li, dateSection } = trophyData;
        if (!li) return;

        // Limpa qualquer badge residual que possa ter ficado na coluna de data (aside)
        if (dateSection) {
            const oldAsideBadge = dateSection.querySelector('.projectcardex-trophy-timeline');
            if (oldAsideBadge) oldAsideBadge.remove();
        }

        // Localiza o container de conteúdo do troféu (<article>)
        const article = li.querySelector('main > article') || li.querySelector('article') || li;

        let timelineEl = article.querySelector('.projectcardex-trophy-timeline');
        if (!timelineEl) {
            timelineEl = document.createElement('div');
            timelineEl.className = 'projectcardex-trophy-timeline';
            article.appendChild(timelineEl);
        }

        if (isFirst) {
            timelineEl.innerHTML = `<span class="projectcardex-time-first" title="Primeiro troféu conquistado">${this.lang === 'pt' ? 'Primeiro troféu' : 'First Trophy'}</span>`;
        } else {
            timelineEl.innerHTML = `
                <span class="projectcardex-time-total" title="Tempo total decorrido desde o início">${totalFormatted}</span>
                <span class="projectcardex-time-diff" title="Tempo desde o troféu anterior">(+${diffFormatted})</span>
            `;
        }

        li.dataset.pcexTimeSignature = signature;
    }

    /**
     * Localiza todos os troféus da página, agrupa por container e processa.
     */
    update() {
        if (!this.isUserGamePage()) {
            // Se saiu da página de jogo, limpa quaisquer badges existentes se necessário
            if (this.lastUrl && this.lastUrl !== window.location.pathname) {
                document.querySelectorAll('.projectcardex-trophy-timeline').forEach(el => el.remove());
                this.lastUrl = window.location.pathname;
            }
            return;
        }

        const isNewUrl = (this.lastUrl !== window.location.pathname);
        this.lastUrl = window.location.pathname;

        const trophyElements = Array.from(document.querySelectorAll('li#trophy-list, li[class*="trophy-list"]'));
        if (trophyElements.length === 0) return;

        if (isNewUrl || !this.hasLoggedPage) {
            console.log(`[projectcardEX] Trophy Timeline ativa em: ${window.location.pathname} (${trophyElements.length} elementos de troféu encontrados)`);
            this.hasLoggedPage = true;
        }

        // Agrupa por elemento pai (desktop vs mobile)
        const containers = new Map();
        for (const li of trophyElements) {
            const parent = li.parentElement;
            if (!parent) continue;
            if (!containers.has(parent)) {
                containers.set(parent, []);
            }
            containers.get(parent).push(li);
        }

        // Processa cada container de forma independente
        for (const [, items] of containers) {
            this.processContainer(items);
        }
    }

    /**
     * Inicializa observadores e loop de verificação.
     */
    init() {
        if (this.isRunning) return;
        this.isRunning = true;
        console.log('[projectcardEX] PsxtTrophyTimeline inicializado.');

        // Execução inicial
        this.update();

        // Observa alterações no DOM para suportar re-renderizações e hidratação SPA
        if (typeof MutationObserver !== 'undefined' && document.body) {
            this.observer = new MutationObserver(() => {
                if (this.isUserGamePage()) {
                    this.update();
                }
            });

            this.observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }
    }
}

if (typeof globalThis !== 'undefined') {
    globalThis.PsxtTrophyTimeline = PsxtTrophyTimeline;
}
if (typeof window !== 'undefined') {
    window.PsxtTrophyTimeline = PsxtTrophyTimeline;
}
