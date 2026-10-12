/**
 * antiCheatStorage.js — Camada de persistência local para Regras e Relatórios Anti-Cheat.
 * 
 * Garante que todas as regras e relatórios fiquem ESTRITAMENTE no navegador do usuário (privacy-first),
 * utilizando chrome.storage.local com fallback transparente para localStorage.
 */

class AntiCheatStorage {
    constructor() {
        this.STORAGE_KEYS = {
            RULES: 'projectcardex_anticheat_rules',
            REPORTS: 'projectcardex_anticheat_reports',
            SETTINGS: 'projectcardex_anticheat_settings'
        };
    }

    /**
     * Verifica se chrome.storage.local está disponível.
     * @returns {boolean}
     */
    isChromeStorageAvailable() {
        return typeof chrome !== 'undefined' && 
               chrome.storage && 
               typeof chrome.storage.local === 'object';
    }

    /**
     * Lê um valor do armazenamento (chrome.storage ou localStorage).
     * @param {string} key
     * @param {*} defaultValue
     * @returns {Promise<*>}
     */
    async get(key, defaultValue = null) {
        if (this.isChromeStorageAvailable()) {
            return new Promise((resolve) => {
                chrome.storage.local.get([key], (result) => {
                    if (chrome.runtime.lastError) {
                        console.error('[AntiCheatStorage] Erro ao ler chrome.storage:', chrome.runtime.lastError);
                        resolve(defaultValue);
                    } else {
                        resolve(result[key] !== undefined ? result[key] : defaultValue);
                    }
                });
            });
        }

        // Fallback para localStorage
        try {
            if (typeof localStorage !== 'undefined') {
                const item = localStorage.getItem(key);
                return item ? JSON.parse(item) : defaultValue;
            }
        } catch (e) {
            console.error('[AntiCheatStorage] Erro ao ler localStorage:', e);
        }

        return defaultValue;
    }

    /**
     * Grava um valor no armazenamento.
     * @param {string} key
     * @param {*} value
     * @returns {Promise<boolean>}
     */
    async set(key, value) {
        if (this.isChromeStorageAvailable()) {
            return new Promise((resolve) => {
                chrome.storage.local.set({ [key]: value }, () => {
                    if (chrome.runtime.lastError) {
                        console.error('[AntiCheatStorage] Erro ao gravar chrome.storage:', chrome.runtime.lastError);
                        resolve(false);
                    } else {
                        resolve(true);
                    }
                });
            });
        }

        // Fallback para localStorage
        try {
            if (typeof localStorage !== 'undefined') {
                localStorage.setItem(key, JSON.stringify(value));
                return true;
            }
        } catch (e) {
            console.error('[AntiCheatStorage] Erro ao gravar localStorage:', e);
        }

        return false;
    }

    // ==========================================
    // REGRAS (RULES)
    // ==========================================

    /**
     * Obtém todas as regras salvas pelo usuário, opcionalmente filtradas por NPWR.
     * @param {string|null} [npwr=null]
     * @returns {Promise<Array>}
     */
    async getRules(npwr = null) {
        const rules = await this.get(this.STORAGE_KEYS.RULES, []);
        if (!Array.isArray(rules)) return [];
        if (!npwr) return rules;

        const cleanNpwr = String(npwr).toUpperCase().trim();
        return rules.filter(r => r && String(r.npwr).toUpperCase().trim() === cleanNpwr);
    }

    /**
     * Salva ou atualiza uma regra.
     * @param {Object} rule
     * @returns {Promise<Object>}
     */
    async saveRule(rule) {
        if (!rule || !rule.npwr || !rule.type) {
            throw new Error('Regra inválida: NPWR e tipo são obrigatórios.');
        }

        const rules = await this.getRules();
        const ruleId = rule.id || `rule_${rule.npwr}_${Date.now()}`;
        const newRule = {
            ...rule,
            id: ruleId,
            npwr: String(rule.npwr).toUpperCase().trim(),
            updatedAt: new Date().toISOString(),
            createdAt: rule.createdAt || new Date().toISOString()
        };

        const existingIndex = rules.findIndex(r => r.id === ruleId);
        if (existingIndex >= 0) {
            rules[existingIndex] = newRule;
        } else {
            rules.push(newRule);
        }

        await this.set(this.STORAGE_KEYS.RULES, rules);
        return newRule;
    }

    /**
     * Exclui uma regra pelo ID.
     * @param {string} ruleId
     * @returns {Promise<boolean>}
     */
    async deleteRule(ruleId) {
        const rules = await this.getRules();
        const filtered = rules.filter(r => r.id !== ruleId);
        return await this.set(this.STORAGE_KEYS.RULES, filtered);
    }

    // ==========================================
    // RELATÓRIOS (REPORTS)
    // ==========================================

    /**
     * Obtém o histórico de relatórios de denúncia emitidos localmente.
     * @returns {Promise<Array>}
     */
    async getReports() {
        const reports = await this.get(this.STORAGE_KEYS.REPORTS, []);
        return Array.isArray(reports) ? reports : [];
    }

    /**
     * Salva um relatório de denúncia no histórico local.
     * @param {Object} report
     * @returns {Promise<Object>}
     */
    async saveReport(report) {
        if (!report) throw new Error('Relatório inválido.');
        const reports = await this.getReports();
        const reportId = report.id || `report_${Date.now()}`;
        const newReport = {
            ...report,
            id: reportId,
            savedAt: new Date().toISOString()
        };

        reports.unshift(newReport); // Mais recente no topo
        // Limita a 100 relatórios locais para evitar consumo excessivo de storage
        if (reports.length > 100) reports.length = 100;

        await this.set(this.STORAGE_KEYS.REPORTS, reports);
        return newReport;
    }

    // ==========================================
    // CONFIGURAÇÕES (SETTINGS)
    // ==========================================

    /**
     * Obtém configurações do anti-cheat (ex: presets do psn100 ativados).
     * @returns {Promise<{psn100_enabled: boolean}>}
     */
    async getSettings() {
        const defaults = { psn100_enabled: true };
        const saved = await this.get(this.STORAGE_KEYS.SETTINGS, defaults);
        return { ...defaults, ...saved };
    }

    /**
     * Salva configurações do anti-cheat.
     * @param {Object} settings
     * @returns {Promise<boolean>}
     */
    async saveSettings(settings) {
        const current = await this.getSettings();
        return await this.set(this.STORAGE_KEYS.SETTINGS, { ...current, ...settings });
    }

    // ==========================================
    // EXPORTAÇÃO E IMPORTAÇÃO DE REGRAS (BACKUP)
    // ==========================================

    /**
     * Exporta todas as regras locais do usuário em formato JSON string.
     * @returns {Promise<string>}
     */
    async exportRulesJson() {
        const rules = await this.getRules();
        return JSON.stringify({
            version: '1.0',
            exportedAt: new Date().toISOString(),
            source: 'projectcardEX Anti-Cheat',
            rules
        }, null, 2);
    }

    /**
     * Importa regras de um JSON string para o armazenamento local.
     * @param {string} jsonString
     * @param {'merge'|'replace'} [mode='merge']
     * @returns {Promise<{imported: number, total: number}>}
     */
    async importRulesJson(jsonString, mode = 'merge') {
        const parsed = JSON.parse(jsonString);
        const incomingRules = Array.isArray(parsed) ? parsed : (Array.isArray(parsed.rules) ? parsed.rules : []);
        if (incomingRules.length === 0) {
            return { imported: 0, total: (await this.getRules()).length };
        }

        let existing = mode === 'replace' ? [] : await this.getRules();
        let importedCount = 0;

        for (const r of incomingRules) {
            if (!r || !r.npwr || !r.type) continue;
            const id = r.id || `rule_${r.npwr}_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
            const idx = existing.findIndex(ex => ex.id === id);
            if (idx >= 0) {
                existing[idx] = { ...r, id };
            } else {
                existing.push({ ...r, id });
            }
            importedCount++;
        }

        await this.set(this.STORAGE_KEYS.RULES, existing);
        return { imported: importedCount, total: existing.length };
    }
}

if (typeof globalThis !== 'undefined') {
    globalThis.AntiCheatStorage = AntiCheatStorage;
}
if (typeof window !== 'undefined') {
    window.AntiCheatStorage = AntiCheatStorage;
}
