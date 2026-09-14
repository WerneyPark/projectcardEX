/**
 * formatters.js — Utilitários de formatação de números, strings e datas para o projectcardEX.
 */

class Formatters {
    /**
     * Formata um número no padrão europeu/brasileiro (ex: 1.250).
     * @param {number|string} n
     * @returns {string}
     */
    static formatNumber(n) {
        return Number(n || 0).toLocaleString("de-DE");
    }

    /**
     * Limpa pontuações de uma string e converte com segurança para Inteiro.
     * Trata casos com múltiplos pontos (ex: "1.250.300"), vírgulas e espaços.
     * @param {string|number} val
     * @returns {number}
     */
    static parseNumber(val) {
        if (typeof val === 'number') return isNaN(val) ? 0 : Math.floor(val);
        if (!val) return 0;
        const cleaned = String(val).replace(/[^\d]/g, '');
        return parseInt(cleaned, 10) || 0;
    }

    /**
     * Retorna a data e hora de geração no formato padrão: "DD/MM/AAAA - HH:mm"
     * @param {Date} [date]
     * @returns {string}
     */
    static formatGenerationDate(date = new Date()) {
        const pad = (num) => String(num).padStart(2, '0');
        const dia = pad(date.getDate());
        const mes = pad(date.getMonth() + 1);
        const ano = date.getFullYear();
        const hora = pad(date.getHours());
        const min = pad(date.getMinutes());
        return `${dia}/${mes}/${ano} - ${hora}:${min}`;
    }
}

if (typeof globalThis !== 'undefined') {
    globalThis.Formatters = Formatters;
}
if (typeof window !== 'undefined') {
    window.Formatters = Formatters;
}
