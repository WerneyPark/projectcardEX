/**
 * antiCheatReportModal.js — Modal Interativo de Criação de Relatório de Denúncia.
 * 
 * Permite ao usuário:
 * 1. Selecionar no mínimo 3 troféus existentes na página do jogo.
 * 2. Explicar a razão técnica/de gameplay pela qual a ordem ou tempo é impossível.
 * 3. Gerar o relatório formatado para impressão (window.print()).
 * 4. Encaminhar para o salvamento de uma regra automatizada no navegador.
 */

class AntiCheatReportModal {
    constructor(options = {}) {
        this.storage = options.storage || (typeof AntiCheatStorage !== 'undefined' ? new AntiCheatStorage() : null);
        this.ruleModal = options.ruleModal || (typeof AntiCheatRuleModal !== 'undefined' ? new AntiCheatRuleModal({ storage: this.storage }) : null);
    }

    /**
     * Abre o modal de denúncia com os dados da página atual.
     * @param {Object} pageData { denouncedUser, gameTitle, npwr, trophies }
     */
    show(pageData) {
        this.close();

        const { denouncedUser = 'Usuário', gameTitle = 'Jogo', npwr = 'NPWR00000_00', trophies = [] } = pageData;
        const earnedTrophies = trophies.filter(t => t.isEarned);

        const overlay = document.createElement('div');
        overlay.id = 'pcex-report-modal-overlay';
        overlay.className = 'pcex-modal-overlay';

        const modal = document.createElement('div');
        modal.className = 'pcex-modal-dialog pcex-modal-large';

        modal.innerHTML = `
            <div class="pcex-modal-header">
                <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="font-size: 20px;">⚠️</span>
                    <div>
                        <h3 style="margin: 0; font-size: 18px; color: #fff;">Gerar Relatório de Denúncia</h3>
                        <div style="font-size: 12px; color: #94a3b8; margin-top: 2px;">
                            Verificação de Inconsistência de Troféus (Ordem ou Tempo)
                        </div>
                    </div>
                </div>
                <button class="pcex-modal-close" id="pcex-report-close-btn">&times;</button>
            </div>

            <div class="pcex-modal-body">
                <div class="pcex-info-banner">
                    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;">
                        <div>
                            <span class="pcex-meta-label">Denunciado:</span>
                            <strong style="color: #f8fafc; display: block;">${denouncedUser}</strong>
                        </div>
                        <div>
                            <span class="pcex-meta-label">Jogo:</span>
                            <strong style="color: #f8fafc; display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${gameTitle}</strong>
                        </div>
                        <div>
                            <span class="pcex-meta-label">Código NPWR:</span>
                            <input type="text" id="pcex-npwr-input" value="${npwr}" class="pcex-input-npwr" title="Código identificador do jogo na PSN" />
                        </div>
                    </div>
                </div>

                <div class="pcex-step-title">
                    <span>1. Selecione os troféus inconsistentes</span>
                    <span id="pcex-selection-counter" class="pcex-counter-badge counter-invalid">0 de no mínimo 3 selecionados</span>
                </div>

                <div class="pcex-trophy-picker-wrapper">
                    <input type="text" id="pcex-trophy-search" placeholder="🔍 Filtrar troféus por nome..." class="pcex-search-input" />
                    
                    <div class="pcex-trophy-scroll-list" id="pcex-trophy-scroll-list">
                        ${earnedTrophies.map((t, idx) => `
                            <label class="pcex-trophy-item" data-name="${String(t.name).toLowerCase()}">
                                <input type="checkbox" class="pcex-trophy-checkbox" data-index="${idx}" />
                                <span class="pcex-trophy-item-icon">
                                    <span class="pcex-trophy-type-indicator type-${(t.type || 'trophy').toLowerCase()}"></span>
                                </span>
                                <div class="pcex-trophy-item-content">
                                    <div class="pcex-trophy-item-title">${t.name}</div>
                                    <div class="pcex-trophy-item-meta">
                                        <span>${t.type || 'Troféu'}</span> • 
                                        <span>${t.earnedDate || (t.timestamp ? new Date(t.timestamp).toLocaleString('pt-BR') : 'Sem data')}</span>
                                    </div>
                                </div>
                            </label>
                        `).join('')}
                    </div>
                </div>

                <div class="pcex-step-title" style="margin-top: 14px;">
                    <span>2. Justificativa da Denúncia</span>
                    <span style="font-size: 11px; color: #94a3b8;">(Explique por que esses troféus não podem ser obtidos nessa ordem/tempo)</span>
                </div>

                <textarea id="pcex-explanation-input" class="pcex-textarea" placeholder="Ex: O troféu de fechar a campanha no difícil foi conquistado antes do troféu do capítulo 1, o que é tecnicamente impossível no jogo..."></textarea>
            </div>

            <div class="pcex-modal-footer">
                <button class="pcex-btn pcex-btn-secondary" id="pcex-cancel-btn">Cancelar</button>
                <button class="pcex-btn pcex-btn-primary pcex-btn-disabled" id="pcex-submit-report-btn" disabled>
                    🖨️ Gerar Relatório & Imprimir
                </button>
            </div>
        `;

        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        // Referências
        const searchInput = modal.querySelector('#pcex-trophy-search');
        const scrollList = modal.querySelector('#pcex-trophy-scroll-list');
        const counterBadge = modal.querySelector('#pcex-selection-counter');
        const explanationInput = modal.querySelector('#pcex-explanation-input');
        const submitBtn = modal.querySelector('#pcex-submit-report-btn');
        const npwrInput = modal.querySelector('#pcex-npwr-input');

        // Filtro de busca na lista
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            const items = scrollList.querySelectorAll('.pcex-trophy-item');
            items.forEach(it => {
                const name = it.dataset.name || '';
                it.style.display = name.includes(query) ? 'flex' : 'none';
            });
        });

        // Validação de seleção
        const updateValidation = () => {
            const selectedCheckboxes = scrollList.querySelectorAll('.pcex-trophy-checkbox:checked');
            const count = selectedCheckboxes.length;
            const hasExplanation = explanationInput.value.trim().length > 5;

            if (count >= 3) {
                counterBadge.textContent = `${count} troféus selecionados (OK)`;
                counterBadge.className = 'pcex-counter-badge counter-valid';
            } else {
                counterBadge.textContent = `${count} de no mínimo 3 selecionados`;
                counterBadge.className = 'pcex-counter-badge counter-invalid';
            }

            if (count >= 3 && hasExplanation) {
                submitBtn.disabled = false;
                submitBtn.classList.remove('pcex-btn-disabled');
            } else {
                submitBtn.disabled = true;
                submitBtn.classList.add('pcex-btn-disabled');
            }
        };

        scrollList.addEventListener('change', updateValidation);
        explanationInput.addEventListener('input', updateValidation);

        // Cancelar / Fechar
        modal.querySelector('#pcex-report-close-btn').addEventListener('click', () => this.close());
        modal.querySelector('#pcex-cancel-btn').addEventListener('click', () => this.close());

        // Ação de Gerar Relatório e Imprimir
        submitBtn.addEventListener('click', async () => {
            const selectedIndices = Array.from(scrollList.querySelectorAll('.pcex-trophy-checkbox:checked'))
                .map(cb => parseInt(cb.dataset.index, 10));

            const selectedTrophies = selectedIndices.map(idx => earnedTrophies[idx]).filter(Boolean);
            const explanation = explanationInput.value.trim();
            const currentNpwr = npwrInput.value.trim().toUpperCase() || npwr;

            const report = {
                id: `report_${Date.now()}_${denouncedUser.replace(/[^a-zA-Z0-9]/g, '')}`,
                denouncedUser,
                gameTitle,
                npwr: currentNpwr,
                explanation,
                selectedTrophies,
                allTrophies: trophies,
                createdAt: new Date().toLocaleString('pt-BR')
            };

            // 1. Salva no storage local
            if (this.storage) {
                await this.storage.saveReport(report);
            }

            // 2. Chama a visualização/janela de impressão
            if (typeof AntiCheatPrintView !== 'undefined') {
                AntiCheatPrintView.print(report);
            }

            // 3. Fecha o modal de denúncia
            this.close();

            // 4. Abre o modal para permitir criar uma regra no navegador
            if (this.ruleModal) {
                setTimeout(() => {
                    this.ruleModal.show({
                        npwr: currentNpwr,
                        gameTitle,
                        selectedTrophies,
                        explanation
                    });
                }, 800);
            }
        });
    }

    /**
     * Fecha e remove o modal da tela.
     */
    close() {
        const el = document.getElementById('pcex-report-modal-overlay');
        if (el) el.remove();
    }
}

if (typeof globalThis !== 'undefined') {
    globalThis.AntiCheatReportModal = AntiCheatReportModal;
}
if (typeof window !== 'undefined') {
    window.AntiCheatReportModal = AntiCheatReportModal;
}
