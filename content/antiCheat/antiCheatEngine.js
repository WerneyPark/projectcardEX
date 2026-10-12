/**
 * antiCheatEngine.js — Motor Lógico de Validação e Detecção de Inconsistências.
 * 
 * Avalia troféus conquistados contra regras cadastradas (regras locais do usuário e presets do PSN100).
 * Totalmente agnóstico a DOM, permitindo testes unitários e reuso transparente.
 */

class AntiCheatEngine {
    constructor(options = {}) {
        this.storage = options.storage || (typeof AntiCheatStorage !== 'undefined' ? new AntiCheatStorage() : null);
        this.presets = options.presets || (typeof AntiCheatPresets !== 'undefined' ? AntiCheatPresets : []);
    }

    /**
     * Localiza um troféu na lista extraída da página a partir de um identificador (nome ou índice de ordem).
     * @param {Array} trophies Lista de troféus da página
     * @param {Object|string} identifier Identificador ({ name, order } ou string de nome)
     * @returns {Object|null}
     */
    findTrophy(trophies, identifier) {
        if (!trophies || !identifier) return null;

        const targetName = typeof identifier === 'string' 
            ? identifier.toLowerCase().trim() 
            : (identifier.name ? String(identifier.name).toLowerCase().trim() : null);
        
        const targetOrder = typeof identifier === 'object' && typeof identifier.order === 'number'
            ? identifier.order
            : null;

        // 1. Tenta buscar por nome (ignora maiúsculas/minúsculas e espaços)
        if (targetName) {
            const foundByName = trophies.find(t => {
                if (!t || !t.name) return false;
                const curName = String(t.name).toLowerCase().trim();
                return curName === targetName || curName.includes(targetName) || targetName.includes(curName);
            });
            if (foundByName) return foundByName;
        }

        // 2. Tenta buscar por índice ordinal se disponível
        if (targetOrder !== null) {
            const foundByOrder = trophies.find(t => t.orderIndex === targetOrder);
            if (foundByOrder) return foundByOrder;
        }

        return null;
    }

    /**
     * Avalia uma regra do tipo 'order' (Ordem Inconsistente).
     * @param {Object} rule
     * @param {Array} matchedTrophies
     * @returns {Object|null}
     */
    evaluateOrderRule(rule, matchedTrophies) {
        // Ordena os troféus encontrados pelo timestamp em que foram conquistados pelo jogador atual
        const chronologicallyEarned = [...matchedTrophies].sort((a, b) => a.timestamp - b.timestamp);

        // Caso 1: Regra especifica uma requiredSequence (ex: A DEVE vir antes de B)
        if (Array.isArray(rule.requiredSequence) && rule.requiredSequence.length >= 2) {
            for (let i = 0; i < rule.requiredSequence.length - 1; i++) {
                const firstId = rule.requiredSequence[i];
                const secondId = rule.requiredSequence[i + 1];

                const tFirst = this.findTrophy(matchedTrophies, firstId);
                const tSecond = this.findTrophy(matchedTrophies, secondId);

                if (tFirst && tSecond && tFirst.isEarned && tSecond.isEarned) {
                    // Se o segundo foi conquistado ANTES do primeiro, há violação
                    if (tSecond.timestamp < tFirst.timestamp) {
                        return {
                            ruleId: rule.id,
                            type: 'order',
                            message: rule.forbiddenOrderNotice || 'esses troféus não costumam ser conquistados nessa ordem',
                            ruleDescription: rule.ruleDescription || 'Inconsistência na sequência de troféus',
                            violatingTrophies: [tSecond, tFirst],
                            details: `"${tSecond.name}" foi conquistado antes de "${tFirst.name}", violando a ordem requerida.`
                        };
                    }
                }
            }
        }

        // Caso 2: Regra criada pelo usuário que gravou a ordem específica como inconsistente (forbiddenOrder / trophies list)
        const targetSequence = rule.forbiddenSequence || rule.trophies || rule.trophyNames;
        if (Array.isArray(targetSequence) && targetSequence.length >= 2) {
            // Verifica se os troféus conquistados pelo jogador atual seguem essa mesma ordem proibida
            const earnedNames = chronologicallyEarned.map(t => String(t.name).toLowerCase().trim());
            const targetNames = targetSequence.map(item => {
                const name = typeof item === 'string' ? item : item.name;
                return String(name || '').toLowerCase().trim();
            }).filter(Boolean);

            if (targetNames.length >= 2) {
                // Checa se a sequência relativa dos troféus bate com a ordem proibida
                let lastIdx = -1;
                let matchesOrder = true;

                for (const tName of targetNames) {
                    const foundIdx = earnedNames.findIndex((en, idx) => idx > lastIdx && (en === tName || en.includes(tName) || tName.includes(en)));
                    if (foundIdx === -1) {
                        matchesOrder = false;
                        break;
                    }
                    lastIdx = foundIdx;
                }

                if (matchesOrder) {
                    return {
                        ruleId: rule.id,
                        type: 'order',
                        message: rule.forbiddenOrderNotice || 'esses troféus não costumam ser conquistados nessa ordem',
                        ruleDescription: rule.ruleDescription || 'Ordem idêntica à denúncia de inconsistência',
                        violatingTrophies: chronologicallyEarned,
                        details: `Os troféus foram conquistados na ordem sinalizada como inconsistente.`
                    };
                }
            }
        }

        return null;
    }

    /**
     * Avalia uma regra do tipo 'time' (Troféus Conquistados Rápido Demais).
     * @param {Object} rule
     * @param {Array} matchedTrophies
     * @returns {Object|null}
     */
    evaluateTimeRule(rule, matchedTrophies) {
        if (!rule.minTimeSeconds || rule.minTimeSeconds <= 0) return null;

        // Ordena cronologicamente
        const sorted = [...matchedTrophies].sort((a, b) => a.timestamp - b.timestamp);
        if (sorted.length < 2) return null;

        // 1. Verifica tempo total entre o primeiro e o último troféu da regra
        const first = sorted[0];
        const last = sorted[sorted.length - 1];
        const totalDiffSeconds = Math.max(0, Math.floor((last.timestamp - first.timestamp) / 1000));

        // 2. Também verifica intervalos consecutivos entre troféus
        let minConsecutiveDiff = Infinity;
        let consecutivePair = null;

        for (let i = 0; i < sorted.length - 1; i++) {
            const diff = Math.max(0, Math.floor((sorted[i + 1].timestamp - sorted[i].timestamp) / 1000));
            if (diff < minConsecutiveDiff) {
                minConsecutiveDiff = diff;
                consecutivePair = [sorted[i], sorted[i + 1]];
            }
        }

        // Se o tempo total for menor que o limite OU o tempo consecutivo for menor que o limite
        const isViolated = totalDiffSeconds < rule.minTimeSeconds || minConsecutiveDiff < rule.minTimeSeconds;

        if (isViolated) {
            const actualSeconds = Math.min(totalDiffSeconds, minConsecutiveDiff);
            return {
                ruleId: rule.id,
                type: 'time',
                message: rule.forbiddenOrderNotice || 'esses troféus não costumam ser conquistados tão rápidos',
                ruleDescription: rule.ruleDescription || `Tempo mínimo esperado: ${rule.minTimeSeconds}s`,
                minTimeSeconds: rule.minTimeSeconds,
                actualTimeSeconds: actualSeconds,
                violatingTrophies: consecutivePair || sorted,
                details: `Troféus conquistados com diferença de ${actualSeconds}s (mínimo esperado: ${rule.minTimeSeconds}s).`
            };
        }

        return null;
    }

    /**
     * Avalia uma regra do tipo 'reference' (Troféu de Referência / Genérica).
     * @param {Object} rule
     * @param {Array} earnedTrophies
     * @returns {Object|null}
     */
    evaluateReferenceRule(rule, earnedTrophies) {
        if (!rule.referenceTrophy || !Array.isArray(rule.targetTrophies) || rule.targetTrophies.length === 0) {
            return null;
        }

        const refTrophy = this.findTrophy(earnedTrophies, rule.referenceTrophy);
        if (!refTrophy || !refTrophy.isEarned || typeof refTrophy.timestamp !== 'number') {
            return null;
        }

        const relation = rule.relation || 'comes_first';
        const violatingTargets = [];

        for (const targetIdentifier of rule.targetTrophies) {
            const targetTrophy = this.findTrophy(earnedTrophies, targetIdentifier);
            if (!targetTrophy || !targetTrophy.isEarned || typeof targetTrophy.timestamp !== 'number') {
                continue;
            }

            if (relation === 'comes_first') {
                // Troféu referência DEVE vir primeiro.
                // Se foi conquistado DEPOIS do troféu alvo, há violação.
                if (refTrophy.timestamp > targetTrophy.timestamp) {
                    violatingTargets.push(targetTrophy);
                }
            } else if (relation === 'comes_after') {
                // Troféu referência DEVE vir depois.
                // Se foi conquistado ANTES do troféu alvo, há violação.
                if (refTrophy.timestamp < targetTrophy.timestamp) {
                    violatingTargets.push(targetTrophy);
                }
            }
        }

        if (violatingTargets.length > 0) {
            const relText = relation === 'comes_first' ? 'vir antes de' : 'vir depois de';
            return {
                ruleId: rule.id,
                type: 'reference',
                badgeText: 'Troféus inconsistentes',
                message: rule.forbiddenOrderNotice || 'esse troféu costuma aparecer em outra ordem',
                ruleDescription: rule.ruleDescription || `Troféu Referência: "${refTrophy.name}"`,
                violatingTrophies: [refTrophy, ...violatingTargets],
                details: `O troféu de referência "${refTrophy.name}" deveria ${relText}: ${violatingTargets.map(t => `"${t.name}"`).join(', ')}.`
            };
        }

        return null;
    }

    /**
     * Executa a avaliação completa dos troféus da página contra todas as regras aplicáveis.
     * @param {string} npwr Código do jogo (ex: 'NPWR08256_00')
     * @param {Array} trophies Lista de todos os troféus da página com status e timestamps
     * @param {Object} [customOptions={}]
     * @returns {Promise<{hasInconsistencies: boolean, inconsistencies: Array}>}
     */
    async evaluate(npwr, trophies, customOptions = {}) {
        if (!npwr || !Array.isArray(trophies) || trophies.length === 0) {
            return { hasInconsistencies: false, inconsistencies: [] };
        }

        const cleanNpwr = String(npwr).toUpperCase().trim();
        const inconsistencies = [];

        // 1. Carrega configurações e regras locais
        let userRules = [];
        let psn100Enabled = true;

        if (this.storage) {
            try {
                userRules = await this.storage.getRules(cleanNpwr);
                const settings = await this.storage.getSettings();
                psn100Enabled = settings.psn100_enabled !== false;
            } catch (e) {
                console.error('[AntiCheatEngine] Erro ao carregar regras do storage:', e);
            }
        }

        // 2. Filtra presets aplicáveis
        const activePresets = psn100Enabled 
            ? this.presets.filter(p => p && String(p.npwr).toUpperCase().trim() === cleanNpwr)
            : [];

        // 3. Combina todas as regras para avaliação
        const allRules = [...userRules, ...activePresets];

        // Filtra apenas troféus conquistados
        const earnedTrophies = trophies.filter(t => t && t.isEarned && typeof t.timestamp === 'number');
        if (earnedTrophies.length < 2) {
            return { hasInconsistencies: false, inconsistencies: [] };
        }

        for (const rule of allRules) {
            // Regra do tipo 'reference' avalia diretamente sobre earnedTrophies
            if (rule.type === 'reference') {
                const refResult = this.evaluateReferenceRule(rule, earnedTrophies);
                if (refResult) {
                    inconsistencies.push(refResult);
                }
                continue;
            }

            // Identifica quais troféus da regra estão presentes na página
            const targets = rule.trophies || rule.trophyIdentifiers || rule.trophyNames || rule.requiredSequence || [];
            const matchedTrophies = [];

            for (const target of targets) {
                const found = this.findTrophy(earnedTrophies, target);
                if (found && !matchedTrophies.some(m => m.name === found.name)) {
                    matchedTrophies.push(found);
                }
            }

            // A regra só pode ser violada se os troféus essenciais foram conquistados
            if (matchedTrophies.length < 2) continue;

            let result = null;
            if (rule.type === 'order') {
                result = this.evaluateOrderRule(rule, matchedTrophies);
            } else if (rule.type === 'time') {
                result = this.evaluateTimeRule(rule, matchedTrophies);
            }

            if (result) {
                inconsistencies.push(result);
            }
        }

        return {
            hasInconsistencies: inconsistencies.length > 0,
            inconsistencies
        };
    }
}

if (typeof globalThis !== 'undefined') {
    globalThis.AntiCheatEngine = AntiCheatEngine;
}
if (typeof window !== 'undefined') {
    window.AntiCheatEngine = AntiCheatEngine;
}
