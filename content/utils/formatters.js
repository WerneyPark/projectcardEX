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

    /**
     * Faz o parse de uma string de data no formato "DD/MM/AAAA HH:mm:ss" ou "DD/MM/AAAA\nHH:mm:ss".
     * Utiliza Date.UTC para garantir imunidade a desvios de fuso horário / horário de verão.
     * @param {string} dateStr
     * @returns {Date|null}
     */
    static parseTrophyDate(dateStr) {
        if (!dateStr || typeof dateStr !== 'string') return null;
        // Suporta com ou sem espaços/quebras/tags entre a data e a hora (ex: "29/03/2015 23:28:46" ou "29/03/201523:28:46" do textContent de <br/>)
        const match = dateStr.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})\D*?(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?/);
        if (!match) return null;
        const [_, day, month, year, hours, minutes, seconds = '0'] = match;
        const d = new Date(Date.UTC(
            parseInt(year, 10),
            parseInt(month, 10) - 1,
            parseInt(day, 10),
            parseInt(hours, 10),
            parseInt(minutes, 10),
            parseInt(seconds, 10)
        ));
        return isNaN(d.getTime()) ? null : d;
    }

    /**
     * Formata uma duração em segundos em unidades legíveis (anos, semanas, dias, horas, minutos, segundos).
     * @param {number} diffSeconds Diferença em segundos
     * @param {'pt'|'en'} [lang='pt'] Idioma das unidades
     * @returns {string}
     */
    static formatTrophyDuration(diffSeconds, lang = 'pt') {
        let sec = Math.max(0, Math.floor(Number(diffSeconds) || 0));
        if (sec === 0) {
            return lang === 'pt' ? '0 segundos' : '0 seconds';
        }

        const SEC_MINUTE = 60;
        const SEC_HOUR = 3600;
        const SEC_DAY = 86400;
        const SEC_WEEK = 604800;
        const SEC_YEAR = 31536000; // 365 dias

        let rem = sec;
        const years = Math.floor(rem / SEC_YEAR);
        rem %= SEC_YEAR;

        const weeks = Math.floor(rem / SEC_WEEK);
        rem %= SEC_WEEK;

        const days = Math.floor(rem / SEC_DAY);
        rem %= SEC_DAY;

        const hours = Math.floor(rem / SEC_HOUR);
        rem %= SEC_HOUR;

        const minutes = Math.floor(rem / SEC_MINUTE);
        rem %= SEC_MINUTE;

        const seconds = rem;

        const parts = [];
        const addPart = (val, singularEn, pluralEn, singularPt, pluralPt) => {
            if (val <= 0) return;
            if (lang === 'pt') {
                parts.push(`${val} ${val === 1 ? singularPt : pluralPt}`);
            } else {
                parts.push(`${val} ${val === 1 ? singularEn : pluralEn}`);
            }
        };

        addPart(years, 'year', 'years', 'ano', 'anos');
        addPart(weeks, 'week', 'weeks', 'semana', 'semanas');
        addPart(days, 'day', 'days', 'dia', 'dias');
        addPart(hours, 'hour', 'hours', 'hora', 'horas');
        addPart(minutes, 'minute', 'minutes', 'minuto', 'minutos');
        addPart(seconds, 'second', 'seconds', 'segundo', 'segundos');

        return parts.length > 0 ? parts.join(', ') : (lang === 'pt' ? '0 segundos' : '0 seconds');
    }
}

if (typeof globalThis !== 'undefined') {
    globalThis.Formatters = Formatters;
}
if (typeof window !== 'undefined') {
    window.Formatters = Formatters;
}
