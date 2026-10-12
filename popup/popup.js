/**
 * popup.js — Controlador do Menu / Popup da Extensão projectcardEX.
 * 
 * Gerencia a navegação por abas, visualização de regras criadas, exportação/importação JSON,
 * toggle dos presets do PSN100 e reimpressão de relatórios de denúncia.
 */

document.addEventListener('DOMContentLoaded', async () => {
  const storage = typeof AntiCheatStorage !== 'undefined' ? new AntiCheatStorage() : null;
  const presets = typeof AntiCheatPresets !== 'undefined' ? AntiCheatPresets : [];

  let userRules = [];
  let userReports = [];
  let currentSettings = { psn100_enabled: true };

  // ========================================================
  // 1. GERENCIAMENTO DE ABAS
  // ========================================================
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.dataset.tab;
      
      tabButtons.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));

      btn.classList.add('active');
      const targetEl = document.getElementById(targetId);
      if (targetEl) targetEl.classList.add('active');
    });
  });

  // ========================================================
  // 2. TOAST DE FEEDBACK
  // ========================================================
  const showToast = (message) => {
    const toast = document.getElementById('popup-toast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('visible');
    setTimeout(() => {
      toast.classList.remove('visible');
    }, 2800);
  };

  // ========================================================
  // 3. CARREGAMENTO DE DADOS
  // ========================================================
  const loadData = async () => {
    if (!storage) return;
    userRules = await storage.getRules();
    userReports = await storage.getReports();
    currentSettings = await storage.getSettings();

    renderOverview();
    renderUserRules();
    renderPresets();
    renderReports();
  };

  // ========================================================
  // 4. RENDERIZAÇÃO: VISÃO GERAL
  // ========================================================
  const renderOverview = () => {
    const rulesCountEl = document.getElementById('metric-rules-count');
    const badgeRulesEl = document.getElementById('badge-rules-count');
    const reportsCountEl = document.getElementById('metric-reports-count');
    const badgeReportsEl = document.getElementById('badge-reports-count');
    const presetsStatusEl = document.getElementById('metric-presets-status');
    const presetsCountEl = document.getElementById('metric-presets-count');

    if (rulesCountEl) rulesCountEl.textContent = userRules.length;
    if (badgeRulesEl) badgeRulesEl.textContent = userRules.length;
    if (reportsCountEl) reportsCountEl.textContent = userReports.length;
    if (badgeReportsEl) badgeReportsEl.textContent = userReports.length;

    if (presetsCountEl) presetsCountEl.textContent = presets.length;
    if (presetsStatusEl) {
      if (currentSettings.psn100_enabled) {
        presetsStatusEl.textContent = 'Ativados';
        presetsStatusEl.className = 'metric-sub text-green';
      } else {
        presetsStatusEl.textContent = 'Desativados';
        presetsStatusEl.className = 'metric-sub text-red';
      }
    }
  };

  // ========================================================
  // 5. RENDERIZAÇÃO: MINHAS REGRAS
  // ========================================================
  const rulesContainer = document.getElementById('rules-list-container');
  const rulesSearchInput = document.getElementById('rules-search-input');

  const renderUserRules = (filterQuery = '') => {
    if (!rulesContainer) return;
    rulesContainer.innerHTML = '';

    const query = filterQuery.toLowerCase().trim();
    const filtered = userRules.filter(r => {
      if (!query) return true;
      const game = (r.gameTitle || '').toLowerCase();
      const npwr = (r.npwr || '').toLowerCase();
      const desc = (r.ruleDescription || '').toLowerCase();
      return game.includes(query) || npwr.includes(query) || desc.includes(query);
    });

    if (filtered.length === 0) {
      rulesContainer.innerHTML = `
        <div class="empty-state">
          <span class="empty-state-icon">⚖️</span>
          ${query ? 'Nenhuma regra encontrada para este filtro.' : 'Você ainda não possui regras salvas.<br>Gere uma denúncia na página de troféus para criar uma regra.'}
        </div>
      `;
      return;
    }

    filtered.forEach(rule => {
      const card = document.createElement('div');
      card.className = 'item-card';

      let typeBadgeClass = 'type-order-badge';
      let typeLabel = 'Ordem';
      if (rule.type === 'time') {
        typeBadgeClass = 'type-time-badge';
        typeLabel = 'Tempo Mínimo';
      } else if (rule.type === 'reference') {
        typeBadgeClass = 'type-reference-badge';
        typeLabel = 'Referência';
      }

      card.innerHTML = `
        <div class="item-card-header">
          <div>
            <span class="item-card-title">${rule.gameTitle || 'Jogo'}</span>
            <span class="item-card-npwr">${rule.npwr || 'NPWR'}</span>
          </div>
          <span class="rule-type-badge ${typeBadgeClass}">${typeLabel}</span>
        </div>

        <div class="item-card-body">
          <div style="font-weight: 600; margin-bottom: 2px;">${rule.ruleDescription || 'Condição de inconsistência'}</div>
          <div style="font-size: 11px; color: #94a3b8;">Mensagem: <em>"${rule.forbiddenOrderNotice || 'Inconsistência'}"</em></div>
        </div>

        <div class="item-card-footer">
          <span>Criada em: ${rule.createdAt ? new Date(rule.createdAt).toLocaleDateString('pt-BR') : '---'}</span>
          <button class="card-action-btn btn-delete" data-id="${rule.id}" title="Excluir regra">🗑️</button>
        </div>
      `;

      // Botão de exclusão
      const delBtn = card.querySelector('.btn-delete');
      delBtn.addEventListener('click', async (e) => {
        e.stopPropagation();
        if (confirm(`Deseja realmente excluir esta regra de ${rule.gameTitle}?`)) {
          await storage.deleteRule(rule.id);
          showToast('Regra excluída com sucesso.');
          await loadData();
        }
      });

      rulesContainer.appendChild(card);
    });
  };

  if (rulesSearchInput) {
    rulesSearchInput.addEventListener('input', (e) => {
      renderUserRules(e.target.value);
    });
  }

  // ========================================================
  // 6. EXPORTAÇÃO E IMPORTAÇÃO DE REGRAS (JSON)
  // ========================================================
  const btnExport = document.getElementById('btn-export-rules');
  const fileImport = document.getElementById('file-import-rules');

  if (btnExport) {
    btnExport.addEventListener('click', async () => {
      if (!storage) return;
      if (userRules.length === 0) {
        showToast('Nenhuma regra para exportar.');
        return;
      }

      const jsonStr = await storage.exportRulesJson();
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `regras_projectcardEX_${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
      showToast('✔ Arquivo de regras exportado com sucesso!');
    });
  }

  if (fileImport) {
    fileImport.addEventListener('change', (e) => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = async (evt) => {
        try {
          const content = evt.target.result;
          const result = await storage.importRulesJson(content, 'merge');
          showToast(`✔ ${result.imported} regra(s) importada(s) com sucesso!`);
          await loadData();
        } catch (err) {
          console.error('[Popup] Erro ao importar regras:', err);
          alert('Erro ao importar arquivo JSON: formato inválido.');
        } finally {
          fileImport.value = '';
        }
      };
      reader.readAsText(file);
    });
  }

  // ========================================================
  // 7. RENDERIZAÇÃO: PRESETS PSN100
  // ========================================================
  const psn100Toggle = document.getElementById('psn100-toggle');
  const presetsContainer = document.getElementById('presets-list-container');

  const renderPresets = () => {
    if (psn100Toggle) {
      psn100Toggle.checked = currentSettings.psn100_enabled !== false;
    }

    if (!presetsContainer) return;
    presetsContainer.innerHTML = '';

    presets.forEach(preset => {
      const card = document.createElement('div');
      card.className = 'item-card';

      let typeBadgeClass = 'type-order-badge';
      let typeLabel = 'Ordem';
      if (preset.type === 'time') {
        typeBadgeClass = 'type-time-badge';
        typeLabel = `Tempo (>${preset.minTimeSeconds}s)`;
      }

      card.innerHTML = `
        <div class="item-card-header">
          <div>
            <span class="item-card-title">${preset.gameTitle}</span>
            <span class="item-card-npwr">${preset.npwr}</span>
          </div>
          <span class="rule-type-badge ${typeBadgeClass}">${typeLabel}</span>
        </div>
        <div class="item-card-body" style="font-size: 11px;">
          ${preset.ruleDescription || 'Regra de integridade PSN100'}
        </div>
      `;

      presetsContainer.appendChild(card);
    });
  };

  if (psn100Toggle) {
    psn100Toggle.addEventListener('change', async (e) => {
      const enabled = e.target.checked;
      await storage.saveSettings({ psn100_enabled: enabled });
      currentSettings.psn100_enabled = enabled;
      renderOverview();
      showToast(enabled ? '✔ Presets PSN100 ativados.' : '⚠️ Presets PSN100 desativados.');
    });
  }

  // ========================================================
  // 8. RENDERIZAÇÃO: HISTÓRICO DE RELATÓRIOS
  // ========================================================
  const reportsContainer = document.getElementById('reports-list-container');
  const btnClearReports = document.getElementById('btn-clear-reports');

  const renderReports = () => {
    if (!reportsContainer) return;
    reportsContainer.innerHTML = '';

    if (userReports.length === 0) {
      reportsContainer.innerHTML = `
        <div class="empty-state">
          <span class="empty-state-icon">📄</span>
          Nenhuma denúncia gerada recentemente.<br>Os relatórios emitidos ficarão arquivados aqui.
        </div>
      `;
      return;
    }

    userReports.forEach((rep, idx) => {
      const card = document.createElement('div');
      card.className = 'item-card';

      const selCount = (rep.selectedTrophies || []).length;

      card.innerHTML = `
        <div class="item-card-header">
          <div>
            <strong style="color: #ef4444; font-size: 13px;">${rep.denouncedUser || 'Usuário'}</strong>
            <span class="item-card-npwr">${rep.npwr || 'NPWR'}</span>
          </div>
          <span style="font-size: 11px; color: #94a3b8;">${rep.createdAt || '---'}</span>
        </div>

        <div style="font-size: 12px; color: #f1f5f9; font-weight: 600;">
          ${rep.gameTitle || 'Jogo'}
        </div>

        <div class="item-card-body" style="font-size: 11px;">
          <em>"${rep.explanation ? (rep.explanation.length > 90 ? rep.explanation.slice(0, 90) + '...' : rep.explanation) : 'Sem justificativa'}"</em>
        </div>

        <div class="item-card-footer">
          <span>${selCount} troféus apontados</span>
          <div style="display: flex; gap: 6px;">
            <button class="btn-print-action" data-idx="${idx}" title="Abrir página de impressão A4">
              🖨️ Reimprimir
            </button>
            <button class="card-action-btn btn-delete btn-del-report" data-id="${rep.id}" title="Excluir do histórico">
              🗑️
            </button>
          </div>
        </div>
      `;

      // Ação de reimprimir
      const printBtn = card.querySelector('.btn-print-action');
      printBtn.addEventListener('click', () => {
        if (typeof AntiCheatPrintView !== 'undefined') {
          AntiCheatPrintView.print(rep);
        } else {
          alert('Módulo de impressão indisponível.');
        }
      });

      // Ação de excluir relatório
      const delBtn = card.querySelector('.btn-del-report');
      delBtn.addEventListener('click', async () => {
        if (confirm(`Deseja excluir o relatório de ${rep.denouncedUser}?`)) {
          const updated = userReports.filter(r => r.id !== rep.id);
          await storage.set(storage.STORAGE_KEYS.REPORTS, updated);
          showToast('Relatório removido do histórico.');
          await loadData();
        }
      });

      reportsContainer.appendChild(card);
    });
  };

  if (btnClearReports) {
    btnClearReports.addEventListener('click', async () => {
      if (userReports.length === 0) return;
      if (confirm('Deseja realmente limpar todo o histórico de relatórios locais?')) {
        await storage.set(storage.STORAGE_KEYS.REPORTS, []);
        showToast('Histórico de relatórios limpo com sucesso.');
        await loadData();
      }
    });
  }

  // Inicialização
  await loadData();
});
