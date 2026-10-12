/**
 * antiCheatRuleModal.js — Modal de Configuração e Criação de Regras Locais pós-denúncia.
 * 
 * Permite ao usuário transformar a denúncia em uma regra automatizada (Ordem ou Tempo),
 * armazenada estritamente no navegador local via AntiCheatStorage.
 */

class AntiCheatRuleModal {
    constructor(options = {}) {
        this.storage = options.storage || (typeof AntiCheatStorage !== 'undefined' ? new AntiCheatStorage() : null);
    }

    /**
     * Renderiza e exibe o modal de criação de regra.
     * @param {Object} data { npwr, gameTitle, selectedTrophies, explanation }
     * @param {Function} [onComplete] Callback após salvar ou cancelar
     */
    show(data, onComplete) {
        this.close();

        const { npwr, gameTitle, selectedTrophies = [] } = data;

        const overlay = document.createElement('div');
        overlay.id = 'pcex-rule-modal-overlay';
        overlay.className = 'pcex-modal-overlay';

        const modal = document.createElement('div');
        modal.className = 'pcex-modal-dialog';

        // Ordena os troféus selecionados pelo timestamp conquistado
        const sortedSelected = [...selectedTrophies].sort((a, b) => a.timestamp - b.timestamp);

        modal.innerHTML = `
            <div class="pcex-modal-header">
                <div>
                    <h3 style="margin: 0; font-size: 18px; color: #fff;">⚙️ Criar Regra de Verificação Automatizada</h3>
                    <div style="font-size: 12px; color: #94a3b8; margin-top: 3px;">
                        A regra será salva <strong>apenas no seu navegador</strong> para alertar futuras inconsistências.
                    </div>
                </div>
                <button class="pcex-modal-close" id="pcex-rule-close-btn">&times;</button>
            </div>

            <div class="pcex-modal-body">
                <div class="pcex-info-banner">
                    <div><strong>Jogo:</strong> ${gameTitle || '---'}</div>
                    <div><strong>NPWR:</strong> <span style="font-family: monospace; color: #38bdf8;">${npwr || '---'}</span></div>
                    <div><strong>Troféus Envolvidos:</strong> ${sortedSelected.length} troféus selecionados</div>
                </div>

                <div class="pcex-trophy-summary-list">
                    ${sortedSelected.map((t, idx) => `
                        <div class="pcex-trophy-summary-item">
                            <span class="pcex-trophy-idx">#${idx + 1}</span>
                            <span class="pcex-trophy-name">${t.name}</span>
                            <span class="pcex-trophy-date">${t.earnedDate || (t.timestamp ? new Date(t.timestamp).toLocaleTimeString() : '')}</span>
                        </div>
                    `).join('')}
                </div>

                <div class="pcex-form-group" style="margin-top: 16px;">
                    <label style="display: block; font-weight: 600; color: #f8fafc; margin-bottom: 8px;">
                        Selecione o Tipo de Regra Obrigatória:
                    </label>

                    <label class="pcex-radio-option" id="pcex-radio-opt-order">
                        <input type="radio" name="pcex-rule-type" value="order" checked />
                        <div>
                            <strong>Regra de Ordem</strong>
                            <div class="pcex-radio-desc">
                                Sinaliza se outro jogador conquistar esses troféus nesta mesma ordem.
                            </div>
                            <div class="pcex-msg-preview">
                                Mensagem exibida: <em>"esses troféus não costumam ser conquistados nessa ordem"</em>
                            </div>
                        </div>
                    </label>

                    <label class="pcex-radio-option" id="pcex-radio-opt-time" style="margin-top: 10px;">
                        <input type="radio" name="pcex-rule-type" value="time" />
                        <div style="flex: 1;">
                            <strong>Regra de Tempo Mínimo</strong>
                            <div class="pcex-radio-desc">
                                Sinaliza se o tempo entre esses troféus for menor do que o mínimo estipulado.
                            </div>
                            <div class="pcex-msg-preview">
                                Mensagem exibida: <em>"esses troféus não costumam ser conquistados tão rápidos"</em>
                            </div>

                            <div id="pcex-time-inputs" style="display: none; margin-top: 10px; align-items: center; gap: 8px;">
                                <label style="font-size: 12px; color: #cbd5e1;">Tempo Mínimo:</label>
                                <input type="number" id="pcex-time-val" min="1" value="10" style="width: 70px; padding: 5px; border-radius: 4px; background: #0f172a; border: 1px solid #334155; color: #fff;" />
                                <select id="pcex-time-unit" style="padding: 5px; border-radius: 4px; background: #0f172a; border: 1px solid #334155; color: #fff;">
                                    <option value="60" selected>Minutos</option>
                                    <option value="1">Segundos</option>
                                    <option value="3600">Horas</option>
                                </select>
                            </div>
                        </div>
                    </label>
                    <label class="pcex-radio-option" id="pcex-radio-opt-reference" style="margin-top: 10px;">
                        <input type="radio" name="pcex-rule-type" value="reference" />
                        <div style="flex: 1;">
                            <strong>Regra com Troféu Referência (Genérica)</strong>
                            <div class="pcex-radio-desc">
                                Escolha um troféu referência e determine se ele deve vir primeiro ou depois dos demais.
                            </div>
                            <div class="pcex-msg-preview">
                                Mensagem exibida: <em>"esse troféu costuma aparecer em outra ordem"</em>
                            </div>

                            <div id="pcex-reference-inputs" style="display: none; margin-top: 12px; flex-direction: column; gap: 10px; background: #0f172a; padding: 12px; border-radius: 6px; border: 1px solid #334155;">
                                <div>
                                    <label style="font-size: 11px; color: #94a3b8; text-transform: uppercase; font-weight: bold; display: block; margin-bottom: 4px;">
                                        1. Troféu de Referência:
                                    </label>
                                    <select id="pcex-ref-trophy-select" style="width: 100%; padding: 6px; border-radius: 4px; background: #1e293b; border: 1px solid #475569; color: #fff; font-size: 13px;">
                                        ${sortedSelected.map(t => `<option value="${t.name}">${t.name}</option>`).join('')}
                                    </select>
                                </div>

                                <div>
                                    <label style="font-size: 11px; color: #94a3b8; text-transform: uppercase; font-weight: bold; display: block; margin-bottom: 6px;">
                                        2. Ordem Esperada da Referência:
                                    </label>
                                    <div style="display: flex; gap: 16px; flex-wrap: wrap;">
                                        <label style="display: flex; align-items: center; gap: 6px; cursor: pointer; color: #e2e8f0; font-size: 12px;">
                                            <input type="radio" name="pcex-ref-relation" value="comes_first" checked />
                                            <span>Vem primeiro (deve ser conquistado antes)</span>
                                        </label>
                                        <label style="display: flex; align-items: center; gap: 6px; cursor: pointer; color: #e2e8f0; font-size: 12px;">
                                            <input type="radio" name="pcex-ref-relation" value="comes_after" />
                                            <span>Vem depois (deve ser conquistado depois)</span>
                                        </label>
                                    </div>
                                </div>

                                <div>
                                    <label style="font-size: 11px; color: #94a3b8; text-transform: uppercase; font-weight: bold; display: block; margin-bottom: 4px;">
                                        3. Troféus Correspondentes Comparados:
                                    </label>
                                    <div id="pcex-ref-targets-container" style="display: flex; flex-direction: column; gap: 4px; max-height: 110px; overflow-y: auto; background: #1e293b; padding: 6px 8px; border-radius: 4px;">
                                        <!-- Checkboxes populados dinamicamente -->
                                    </div>
                                </div>
                            </div>
                        </div>
                    </label>
                </div>
            </div>

            <div class="pcex-modal-footer">
                <button class="pcex-btn pcex-btn-secondary" id="pcex-rule-skip-btn">Pular (Não criar regra)</button>
                <button class="pcex-btn pcex-btn-primary" id="pcex-rule-save-btn">Salvar Regra no Navegador</button>
            </div>
        `;

        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        // Interação dos radios
        const radioOrder = modal.querySelector('input[value="order"]');
        const radioTime = modal.querySelector('input[value="time"]');
        const radioReference = modal.querySelector('input[value="reference"]');
        const timeInputs = modal.querySelector('#pcex-time-inputs');
        const referenceInputs = modal.querySelector('#pcex-reference-inputs');

        const refSelect = modal.querySelector('#pcex-ref-trophy-select');
        const targetsContainer = modal.querySelector('#pcex-ref-targets-container');

        const renderTargets = () => {
            if (!targetsContainer || !refSelect) return;
            const currentRef = refSelect.value;
            const remaining = sortedSelected.filter(t => t.name !== currentRef);
            targetsContainer.innerHTML = remaining.map((t, idx) => `
                <label style="display: flex; align-items: center; gap: 8px; font-size: 12px; color: #f1f5f9; cursor: pointer;">
                    <input type="checkbox" class="pcex-ref-target-cb" value="${t.name}" checked style="accent-color: #ef4444;" />
                    <span>${t.name}</span>
                </label>
            `).join('');
        };

        renderTargets();
        if (refSelect) {
            refSelect.addEventListener('change', renderTargets);
        }

        const updateVisibility = () => {
            timeInputs.style.display = radioTime.checked ? 'flex' : 'none';
            referenceInputs.style.display = radioReference.checked ? 'flex' : 'none';
        };

        radioOrder.addEventListener('change', updateVisibility);
        radioTime.addEventListener('change', updateVisibility);
        radioReference.addEventListener('change', updateVisibility);

        // Fechar / Cancelar
        const handleClose = () => {
            this.close();
            if (typeof onComplete === 'function') onComplete(null);
        };

        modal.querySelector('#pcex-rule-close-btn').addEventListener('click', handleClose);
        modal.querySelector('#pcex-rule-skip-btn').addEventListener('click', handleClose);

        // Salvar Regra
        modal.querySelector('#pcex-rule-save-btn').addEventListener('click', async () => {
            let rule = null;

            if (radioOrder.checked) {
                rule = {
                    npwr,
                    gameTitle,
                    type: 'order',
                    ruleDescription: `Ordem inconsistente de troféus (${sortedSelected.map(t => t.name).join(' -> ')})`,
                    trophies: sortedSelected.map(t => ({
                        name: t.name,
                        order: t.orderIndex !== undefined ? t.orderIndex : null
                    })),
                    forbiddenSequence: sortedSelected.map(t => t.name),
                    minTimeSeconds: 0,
                    forbiddenOrderNotice: 'esses troféus não costumam ser conquistados nessa ordem'
                };
            } else if (radioTime.checked) {
                const val = parseFloat(modal.querySelector('#pcex-time-val').value) || 1;
                const unit = parseInt(modal.querySelector('#pcex-time-unit').value, 10) || 60;
                const minTimeSeconds = Math.round(val * unit);

                rule = {
                    npwr,
                    gameTitle,
                    type: 'time',
                    ruleDescription: `Tempo mínimo entre troféus (${minTimeSeconds}s)`,
                    trophies: sortedSelected.map(t => ({
                        name: t.name,
                        order: t.orderIndex !== undefined ? t.orderIndex : null
                    })),
                    minTimeSeconds,
                    forbiddenOrderNotice: 'esses troféus não costumam ser conquistados tão rápidos'
                };
            } else if (radioReference.checked) {
                const refTrophy = refSelect.value;
                const relation = modal.querySelector('input[name="pcex-ref-relation"]:checked').value;
                const targetCheckboxes = Array.from(modal.querySelectorAll('.pcex-ref-target-cb:checked'));
                const targetTrophies = targetCheckboxes.map(cb => cb.value);

                if (targetTrophies.length === 0) {
                    alert('Por favor, selecione pelo menos um troféu correspondente para comparar.');
                    return;
                }

                const relLabel = relation === 'comes_first' ? 'Vem primeiro' : 'Vem depois';
                rule = {
                    npwr,
                    gameTitle,
                    type: 'reference',
                    referenceTrophy: refTrophy,
                    relation,
                    targetTrophies,
                    badgeText: 'Troféus inconsistentes',
                    forbiddenOrderNotice: 'esse troféu costuma aparecer em outra ordem',
                    ruleDescription: `Troféu "${refTrophy}" (${relLabel})`,
                    trophies: sortedSelected.map(t => ({
                        name: t.name,
                        order: t.orderIndex !== undefined ? t.orderIndex : null
                    }))
                };
            }

            if (rule && this.storage) {
                await this.storage.saveRule(rule);
            }

            this.close();

            // Exibe notificação de confirmação
            this.showToast('✔ Regra salva com sucesso no seu navegador!');

            if (typeof onComplete === 'function') onComplete(rule);
        });
    }

    /**
     * Exibe toast temporário de confirmação.
     * @param {string} msg
     */
    showToast(msg) {
        const toast = document.createElement('div');
        toast.className = 'pcex-toast-notification';
        toast.textContent = msg;
        document.body.appendChild(toast);
        setTimeout(() => toast.classList.add('visible'), 50);
        setTimeout(() => {
            toast.classList.remove('visible');
            setTimeout(() => toast.remove(), 300);
        }, 3500);
    }

    /**
     * Fecha e remove o modal.
     */
    close() {
        const el = document.getElementById('pcex-rule-modal-overlay');
        if (el) el.remove();
    }
}

if (typeof globalThis !== 'undefined') {
    globalThis.AntiCheatRuleModal = AntiCheatRuleModal;
}
if (typeof window !== 'undefined') {
    window.AntiCheatRuleModal = AntiCheatRuleModal;
}
