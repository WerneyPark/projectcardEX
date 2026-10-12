/**
 * antiCheatUI.js — Controlador de Interface de Usuário para o Módulo Anti-Cheat.
 * 
 * Injeta na página de jogo de outro usuário:
 * 1. O botão de triângulo (⚠️) para "Gerar relatório de denúncia" ao lado do tempo/nome do jogo.
 * 2. O badge "Lista inconsistente" quando o motor detecta violação de regras (ordem ou tempo).
 * 3. O balão de alerta com as mensagens exatas solicitadas ao clicar na indicação.
 */

class AntiCheatUI {
    constructor(options = {}) {
        this.storage = options.storage || (typeof AntiCheatStorage !== 'undefined' ? new AntiCheatStorage() : null);
        this.engine = options.engine || (typeof AntiCheatEngine !== 'undefined' ? new AntiCheatEngine({ storage: this.storage }) : null);
        this.reportModal = options.reportModal || (typeof AntiCheatReportModal !== 'undefined' ? new AntiCheatReportModal({ storage: this.storage }) : null);

        this.isRunning = false;
        this.lastUrl = '';
        this.lastEvaluationKey = '';
        this.lastInconsistencies = null;
        this.isEvaluating = false;
        this.mutationTimer = null;
    }

    /**
     * Verifica se a página atual é a página de troféus de um usuário para um jogo específico.
     * Exemplo: /WerneyPark/jogo/08256-sword-art-online-lost-song
     * @returns {boolean}
     */
    isUserGamePage() {
        if (typeof window === 'undefined' || !window.location) return false;
        const pathParts = window.location.pathname.split('/').filter(Boolean);
        const reservedRoots = ['jogo', 'jogos', 'ranking', 'rankings', 'guias', 'noticias', 'feed', 'membros', 'faq', 'insignias'];
        if (pathParts.length < 2) return false;
        if (reservedRoots.includes(pathParts[0].toLowerCase())) return false;
        if (pathParts[1].toLowerCase() !== 'jogo') return false;
        if (pathParts[3] && pathParts[3].toLowerCase() === 'trofeu') return false;
        return true;
    }

    /**
     * Extrai dados contextuais da página atual (Denunciado, Jogo, NPWR e Troféus).
     * @returns {Object|null}
     */
    extractPageData() {
        if (!this.isUserGamePage()) return null;

        const pathParts = window.location.pathname.split('/').filter(Boolean);
        const denouncedUser = pathParts[0] || 'Desconhecido';
        const gameSlug = pathParts[2] || '';

        // 1. Extrai NPWR do Slug ou do DOM
        let npwr = '';
        // Slug do tipo: 08256-sword-art-online-lost-song -> NPWR08256_00
        const slugCodeMatch = gameSlug.match(/^(\d{4,6})/);
        if (slugCodeMatch) {
            const padded = slugCodeMatch[1].padStart(5, '0');
            npwr = `NPWR${padded}_00`;
        } else if (gameSlug.toUpperCase().startsWith('NPWR')) {
            const matchFull = gameSlug.match(/(NPWR\d+_\d+)/i);
            if (matchFull) npwr = matchFull[1].toUpperCase();
        }

        // Fallback: busca por padrão NPWR em imagens ou links da página
        if (!npwr) {
            const npwrImg = document.querySelector('img[src*="NPWR"], a[href*="NPWR"]');
            if (npwrImg) {
                const src = npwrImg.src || npwrImg.href || '';
                const match = src.match(/(NPWR\d+_\d+)/i);
                if (match) npwr = match[1].toUpperCase();
            }
        }

        if (!npwr) {
            npwr = 'NPWR00000_00';
        }

        // 2. Extrai Nome do Jogo
        let gameTitle = '';
        const titleH1 = document.querySelector('h1, h2, .desktop_game-title, [class*="game-title"], [class*="game_title"]');
        if (titleH1) {
            gameTitle = (titleH1.innerText || titleH1.textContent || '').trim();
        }
        if (!gameTitle && gameSlug) {
            // Converte slug: 08256-sword-art-online-lost-song -> Sword Art Online Lost Song
            gameTitle = gameSlug.replace(/^\d+-/, '').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        }

        // 3. Extrai Contagem Total Real do Jogo (evita duplicação desktop+mobile)
        let expectedTotal = 0;
        const trophiesSection = document.querySelector('section[class*="trophies"]');
        if (trophiesSection) {
            const spans = trophiesSection.querySelectorAll('div > span, span');
            if (spans.length >= 5) {
                const totalText = (spans[4].innerText || spans[4].textContent || '').replace(/[^\d]/g, '');
                expectedTotal = parseInt(totalText, 10) || 0;
            }
            if (!expectedTotal && spans.length >= 4) {
                const p = parseInt((spans[0].innerText || spans[0].textContent || '').replace(/[^\d]/g, ''), 10) || 0;
                const g = parseInt((spans[1].innerText || spans[1].textContent || '').replace(/[^\d]/g, ''), 10) || 0;
                const s = parseInt((spans[2].innerText || spans[2].textContent || '').replace(/[^\d]/g, ''), 10) || 0;
                const b = parseInt((spans[3].innerText || spans[3].textContent || '').replace(/[^\d]/g, ''), 10) || 0;
                expectedTotal = p + g + s + b;
            }
        }

        // 4. Extrai Troféus isolando apenas o container primário (Desktop)
        const allTrophyElements = Array.from(document.querySelectorAll('li#trophy-list, li[class*="trophy-list"]'));
        
        // Agrupa por elemento pai (desktop vs mobile)
        const containers = new Map();
        for (const li of allTrophyElements) {
            const parent = li.parentElement;
            if (!parent) continue;
            if (!containers.has(parent)) {
                containers.set(parent, []);
            }
            containers.get(parent).push(li);
        }

        const primaryItems = containers.size > 0 ? containers.values().next().value : allTrophyElements;
        const trophies = [];
        const seenNames = new Set();

        primaryItems.forEach((li, idx) => {
            const article = li.querySelector('article') || li;
            
            // Título
            const titleEl = article.querySelector('h3, h4, strong, a, [class*="title"]') || article;
            const name = titleEl ? (titleEl.innerText || titleEl.textContent || '').split('\n')[0].trim() : `Troféu #${idx + 1}`;

            // Deduplica por nome para evitar qualquer duplicidade no mesmo container
            const lowerName = name.toLowerCase();
            if (seenNames.has(lowerName)) return;
            seenNames.add(lowerName);

            // Descrição
            const descEl = article.querySelector('p, [class*="desc"]') || article;
            let description = '';
            if (descEl && descEl !== titleEl) {
                description = (descEl.innerText || descEl.textContent || '').trim();
            }

            // Tipo (Platina, Ouro, Prata, Bronze)
            let type = 'Troféu';
            const img = li.querySelector('aside img, img');
            if (img && img.src) {
                const s = img.src.toLowerCase();
                if (s.includes('plat')) type = 'Platina';
                else if (s.includes('gold') || s.includes('ouro')) type = 'Ouro';
                else if (s.includes('silver') || s.includes('prata')) type = 'Prata';
                else if (s.includes('bronze')) type = 'Bronze';
            }

            // Data/Hora
            let isEarned = false;
            let earnedDate = '';
            let timestamp = null;

            const aside = li.querySelector('aside');
            if (aside) {
                const spans = aside.querySelectorAll('span');
                for (const sp of spans) {
                    // Limpa tags HTML (como <br>) substituindo por espaço para máxima robustez
                    const rawHtml = sp.innerHTML || '';
                    const cleanText = rawHtml.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
                    const text = cleanText || (sp.innerText || sp.textContent || '').trim();

                    if (text.includes('/')) {
                        const date = typeof Formatters !== 'undefined' && typeof Formatters.parseTrophyDate === 'function'
                            ? Formatters.parseTrophyDate(text)
                            : null;
                        if (date) {
                            isEarned = true;
                            earnedDate = text.replace(/\s+/g, ' ');
                            timestamp = date.getTime();
                            break;
                        }
                    }
                }
            }

            trophies.push({
                li,
                orderIndex: idx,
                name,
                description,
                type,
                isEarned,
                earnedDate,
                timestamp
            });
        });

        // Se a página informa o total real de troféus, limita rigorosamente a esse número
        const finalTrophies = (expectedTotal > 0 && trophies.length > expectedTotal)
            ? trophies.slice(0, expectedTotal)
            : trophies;

        return {
            denouncedUser,
            gameTitle,
            npwr,
            trophies: finalTrophies
        };
    }

    /**
     * Localiza o elemento <aside> principal da barra lateral do jogo.
     * Descarta os <aside> internos dos itens da lista de troféus (li aside).
     * @returns {HTMLElement|null}
     */
    findGameAside() {
        if (typeof document === 'undefined') return null;

        // 1. Procura por <aside> que NÃO esteja dentro de um item de troféu (li)
        const asides = Array.from(document.querySelectorAll('aside')).filter(a => {
            if (typeof a.closest === 'function') {
                return !a.closest('li') && !a.closest('#trophy-list');
            }
            let p = a.parentElement;
            while (p) {
                if (p.tagName === 'LI' || p.id === 'trophy-list') return false;
                p = p.parentElement;
            }
            return true;
        });

        if (asides.length > 0) {
            // Se houver mais de um, seleciona aquele com informações contextuais do jogo
            const gameAside = asides.find(a => {
                const text = a.innerText || a.textContent || '';
                return a.querySelector('img') && (text.includes('Tempo') || text.includes('Nota') || a.querySelector('h1, h2, strong, [class*="game"]'));
            });
            return gameAside || asides[0];
        }

        // 2. Fallbacks caso não utilize a tag <aside>
        return document.querySelector('.desktop_game-info, [class*="game-info"], .game-sidebar');
    }

    /**
     * Localiza a seção de "Nota" e retorna/cria o slot dedicado DENTRO do <aside> da barra lateral.
     * Garante que o slot fique sempre alocado como filho do <aside>, logo abaixo das estrelas.
     * @returns {HTMLElement|null}
     */
    getOrCreateSlot() {
        if (typeof document === 'undefined') return null;

        const gameAside = this.findGameAside();
        let slot = document.getElementById('pcex-anticheat-slot');

        // Se o slot já existe:
        if (slot) {
            // Se tivermos o aside e o slot estiver fora dele, move para dentro do aside
            if (gameAside) {
                const isInside = (typeof gameAside.contains === 'function')
                    ? gameAside.contains(slot)
                    : (slot.parentElement === gameAside);
                if (!isInside) {
                    gameAside.appendChild(slot);
                }
            }
            return slot;
        }

        slot = document.createElement('div');
        slot.id = 'pcex-anticheat-slot';
        slot.className = 'pcex-anticheat-slot';

        // 1. Se localizamos o <aside> da barra lateral:
        if (gameAside) {
            // Tenta localizar a seção/texto de "Nota" ou estrelas especificamente DENTRO do aside
            const allCandidates = Array.from(gameAside.querySelectorAll('span, p, div, label, h3, h4, h5, strong, b'));
            const notaLabel = allCandidates.find(el => {
                if (el.children && el.children.length > 2) return false;
                const txt = (el.innerText || el.textContent || '').trim().toLowerCase();
                return txt === 'nota' || txt.startsWith('nota:') || txt.startsWith('nota ');
            });

            if (notaLabel) {
                // Encontra o bloco filho direto ou quase direto de gameAside correspondente à avaliação
                let ratingBlock = notaLabel;
                while (ratingBlock.parentElement && ratingBlock.parentElement !== gameAside) {
                    ratingBlock = ratingBlock.parentElement;
                }

                // Insere logo após o bloco da nota/estrelas mantendo-se estritamente DENTRO do gameAside
                if (ratingBlock && ratingBlock.parentElement === gameAside) {
                    if (ratingBlock.nextSibling) {
                        gameAside.insertBefore(slot, ratingBlock.nextSibling);
                    } else {
                        gameAside.appendChild(slot);
                    }
                    return slot;
                }
            }

            // Se a nota não tiver bloco filho isolado, insere no final do aside (onde ficam as estrelas)
            gameAside.appendChild(slot);
            return slot;
        }

        // 2. Fallback caso não haja <aside> na página:
        const allCandidates = Array.from(document.querySelectorAll('span, p, div, label, h3, h4, h5, strong, b'));
        const timeLabel = allCandidates.find(el => {
            const txt = (el.innerText || el.textContent || '').toLowerCase().trim();
            return (txt.includes('tempo da platina') || txt.includes('tempo de platina') || txt.includes('tempo do 100%')) && 
                   (!el.children || el.children.length === 0);
        });

        if (timeLabel) {
            const parent = timeLabel.parentElement || timeLabel;
            if (typeof parent.insertAdjacentElement === 'function') {
                parent.insertAdjacentElement('afterend', slot);
            } else if (parent.parentNode && typeof parent.parentNode.insertBefore === 'function') {
                parent.parentNode.insertBefore(slot, parent.nextSibling);
            } else {
                parent.appendChild(slot);
            }
            return slot;
        }

        // 3. Fallback: Cabeçalho
        const titleEl = document.querySelector('h1, [class*="game-title"]');
        if (titleEl) {
            const parent = titleEl.parentElement || titleEl;
            parent.appendChild(slot);
            return slot;
        }

        return null;
    }

    /**
     * Retorna o alvo de inserção (o slot anti-cheat abaixo da Nota).
     * @returns {HTMLElement|null}
     */
    findInsertionTarget() {
        return this.getOrCreateSlot();
    }

    /**
     * Injeta o botão de denúncia (⚠️ Denunciar) dentro do slot abaixo da Nota.
     * @param {Object} pageData
     */
    injectReportButton(pageData) {
        const slot = this.getOrCreateSlot();
        if (!slot) return;

        let btn = document.getElementById('pcex-report-btn');
        if (btn) {
            if (btn.parentElement !== slot) {
                slot.appendChild(btn);
            }
            return;
        }

        btn = document.createElement('button');
        btn.id = 'pcex-report-btn';
        btn.className = 'pcex-report-slot-btn';
        btn.title = 'Gerar relatório de denúncia';
        btn.innerHTML = `
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" stroke="#ef4444" fill="#fee2e2" />
                <line x1="12" y1="9" x2="12" y2="13" stroke="#b91c1c" />
                <line x1="12" y1="17" x2="12.01" y2="17" stroke="#b91c1c" />
            </svg>
            <span>Gerar Relatorio - Denuncia</span>
        `;

        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (this.reportModal) {
                const freshData = this.extractPageData();
                this.reportModal.show(freshData || pageData);
            }
        });

        slot.appendChild(btn);
    }

    /**
     * Injeta ou atualiza o badge de alerta "Lista inconsistente" ou "Troféus inconsistentes" dentro do slot.
     * @param {Array} inconsistencies
     */
    injectInconsistentBadge(inconsistencies) {
        const slot = this.getOrCreateSlot();
        let badge = document.getElementById('pcex-inconsistent-badge');

        if (!inconsistencies || inconsistencies.length === 0) {
            if (badge) badge.remove();
            return;
        }

        const hasRefViolation = inconsistencies.some(i => i.type === 'reference' || i.badgeText === 'Troféus inconsistentes');
        const badgeLabel = hasRefViolation ? 'Troféus inconsistentes' : 'Lista inconsistente';

        if (!badge) {
            badge = document.createElement('div');
            badge.id = 'pcex-inconsistent-badge';
            badge.className = 'pcex-inconsistent-badge';
            badge.innerHTML = `
                <span class="pcex-inconsistent-icon">⚠️</span>
                <span class="pcex-inconsistent-text">${badgeLabel}</span>
            `;

            badge.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.showInconsistencyPopover(inconsistencies);
            });

            if (slot) {
                // Insere no início do slot para ficar em destaque acima do botão de denúncia
                slot.insertBefore(badge, slot.firstChild);
            }
        } else {
            const textEl = badge.querySelector('.pcex-inconsistent-text');
            if (textEl) textEl.textContent = badgeLabel;
            if (slot && badge.parentElement !== slot) {
                slot.insertBefore(badge, slot.firstChild);
            }
        }
    }

    /**
     * Exibe o modal/popover de detalhes ao clicar em "Lista inconsistente".
     * @param {Array} inconsistencies
     */
    showInconsistencyPopover(inconsistencies) {
        const existing = document.getElementById('pcex-inconsistent-popover');
        if (existing) existing.remove();

        const overlay = document.createElement('div');
        overlay.id = 'pcex-inconsistent-popover';
        overlay.className = 'pcex-modal-overlay';

        const dialog = document.createElement('div');
        dialog.className = 'pcex-modal-dialog';
        dialog.style.maxWidth = '500px';

        const itemsHtml = inconsistencies.map((inc, idx) => `
            <div class="pcex-inconsistency-card">
                <div style="font-weight: bold; color: #ef4444; font-size: 15px; margin-bottom: 4px;">
                    ⚠️ ${inc.message}
                </div>
                <div style="font-size: 12px; color: #cbd5e1; margin-bottom: 8px;">
                    ${inc.details || inc.ruleDescription || ''}
                </div>
                <div style="font-size: 11px; color: #94a3b8; background: #0f172a; padding: 6px 10px; border-radius: 4px;">
                    <strong>Troféus envolvidos:</strong>
                    <ul style="margin: 4px 0 0 16px; padding: 0;">
                        ${(inc.violatingTrophies || []).map(t => `<li>${t.name} (${t.earnedDate || 'Sem data'})</li>`).join('')}
                    </ul>
                </div>
            </div>
        `).join('');

        dialog.innerHTML = `
            <div class="pcex-modal-header">
                <h3 style="margin: 0; font-size: 16px; color: #fff;">Alerta de Verificação — projectcardEX</h3>
                <button class="pcex-modal-close" id="pcex-popover-close-btn">&times;</button>
            </div>
            <div class="pcex-modal-body">
                ${itemsHtml}
            </div>
            <div class="pcex-modal-footer">
                <button class="pcex-btn pcex-btn-primary" id="pcex-popover-ok-btn">Entendido</button>
            </div>
        `;

        overlay.appendChild(dialog);
        document.body.appendChild(overlay);

        const close = () => overlay.remove();
        dialog.querySelector('#pcex-popover-close-btn').addEventListener('click', close);
        dialog.querySelector('#pcex-popover-ok-btn').addEventListener('click', close);
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) close();
        });
    }

    /**
     * Executa a checagem e atualização da UI na página de jogo.
     */
    async update() {
        if (!this.isUserGamePage()) {
            const slot = document.getElementById('pcex-anticheat-slot');
            if (slot) slot.remove();
            const btn = document.getElementById('pcex-report-btn');
            if (btn) btn.remove();
            const badge = document.getElementById('pcex-inconsistent-badge');
            if (badge) badge.remove();
            this.lastEvaluationKey = '';
            this.lastInconsistencies = null;
            return;
        }

        const pageData = this.extractPageData();
        if (!pageData) return;

        // 1. Injeta ou garante o botão de denúncia dentro do slot no <aside>
        this.injectReportButton(pageData);

        // 2. Se já possuímos inconsistências identificadas, garante persistência do badge no DOM
        if (this.lastInconsistencies && this.lastInconsistencies.length > 0) {
            const currentBadge = document.getElementById('pcex-inconsistent-badge');
            const slot = this.getOrCreateSlot();
            if (!currentBadge || (slot && currentBadge.parentElement !== slot)) {
                this.injectInconsistentBadge(this.lastInconsistencies);
            }
        }

        // 3. Executa o motor anti-cheat se houver troféus
        if (this.engine && pageData.trophies.length > 0) {
            const earnedCount = pageData.trophies.filter(t => t.isEarned).length;
            const evalKey = `${pageData.denouncedUser}_${pageData.npwr}_${pageData.trophies.length}_${earnedCount}`;
            
            if (evalKey !== this.lastEvaluationKey && !this.isEvaluating) {
                this.isEvaluating = true;
                try {
                    const result = await this.engine.evaluate(pageData.npwr, pageData.trophies);
                    this.lastEvaluationKey = evalKey;
                    this.lastInconsistencies = result.inconsistencies || [];
                    this.injectInconsistentBadge(this.lastInconsistencies);
                } catch (err) {
                    console.error('[projectcardEX] Erro ao avaliar inconsistências:', err);
                } finally {
                    this.isEvaluating = false;
                }
            }
        }
    }

    /**
     * Inicializa observador e listeners com debounce e verificações de acomodação.
     */
    init() {
        if (this.isRunning) return;
        this.isRunning = true;
        console.log('[projectcardEX] AntiCheatUI inicializado.');

        // 1. Execução imediata
        this.update();

        // 2. Ciclos de acomodação para hidratação progressiva da página
        const settleDelays = [300, 800, 1500, 3000];
        settleDelays.forEach(delay => {
            setTimeout(() => {
                if (this.isUserGamePage()) {
                    this.update();
                }
            }, delay);
        });

        // 3. MutationObserver com debounce de 150ms
        if (typeof MutationObserver !== 'undefined' && document.body) {
            this.observer = new MutationObserver(() => {
                if (!this.isUserGamePage()) return;
                if (this.mutationTimer) clearTimeout(this.mutationTimer);
                this.mutationTimer = setTimeout(() => {
                    this.update();
                }, 150);
            });

            this.observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }
    }
}

if (typeof globalThis !== 'undefined') {
    globalThis.AntiCheatUI = AntiCheatUI;
}
if (typeof window !== 'undefined') {
    window.AntiCheatUI = AntiCheatUI;
}
