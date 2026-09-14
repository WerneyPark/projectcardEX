/**
 * levelCalculator.js — Utilitário oficial de cálculo de nível, pontos e patentes da PSN.
 */

class LevelCalculator {
    /**
     * Calcula os pontos oficiais PSN a partir das quantidades de troféus.
     * Platina: 300 pts, Ouro: 90 pts, Prata: 30 pts, Bronze: 15 pts.
     * @param {number|string} plat
     * @param {number|string} gold
     * @param {number|string} silver
     * @param {number|string} bronze
     * @returns {number}
     */
    static calculatePoints(plat = 0, gold = 0, silver = 0, bronze = 0) {
        const p = Number(plat) || 0;
        const g = Number(gold) || 0;
        const s = Number(silver) || 0;
        const b = Number(bronze) || 0;
        return (p * 300) + (g * 90) + (s * 30) + (b * 15);
    }

    /**
     * Calcula o nível PSN em ponto flutuante bruto a partir dos pontos.
     * @param {number} points
     * @returns {number}
     */
    static calculateRawLevel(points) {
        const p = Number(points) || 0;
        if (p <= 0) return 1;
        if (p <= 5940) return (p / 60) + 1;
        if (p <= 14940) return ((p - 5940) / 90) + 100;
        if (p <= 59940) return ((p - 14940) / 450) + 200;
        if (p <= 149940) return ((p - 59940) / 900) + 300;
        if (p <= 284940) return ((p - 149940) / 1350) + 400;
        if (p <= 464940) return ((p - 284940) / 1800) + 500;
        if (p <= 689940) return ((p - 464940) / 2250) + 600;
        if (p <= 959940) return ((p - 689940) / 2700) + 700;
        if (p <= 1274940) return ((p - 959940) / 3150) + 800;
        if (p <= 1634940) return ((p - 1274940) / 3600) + 900;
        if (p <= 2039940) return ((p - 1634940) / 4050) + 1000;
        if (p <= 2489940) return ((p - 2039940) / 4500) + 1100;
        if (p <= 2984940) return ((p - 2489940) / 4950) + 1200;
        if (p <= 3524940) return ((p - 2984940) / 5400) + 1300;
        if (p <= 4109940) return ((p - 3524940) / 5850) + 1400;
        if (p <= 4739940) return ((p - 4109940) / 6300) + 1500;
        if (p <= 5414940) return ((p - 4739940) / 6750) + 1600;
        if (p <= 6134940) return ((p - 5414940) / 7200) + 1700;
        if (p <= 6899940) return ((p - 6134940) / 7650) + 1800;
        if (p <= 7709940) return ((p - 6899940) / 8100) + 1900;
        if (p <= 8564940) return ((p - 7709940) / 8550) + 2000;
        if (p <= 9464940) return ((p - 8564940) / 9000) + 2100;
        if (p <= 10409940) return ((p - 9464940) / 9450) + 2200;
        if (p <= 11399940) return ((p - 10409940) / 9900) + 2300;
        if (p <= 12434940) return ((p - 11399940) / 10350) + 2400;
        if (p <= 13514940) return ((p - 12434940) / 10800) + 2500;
        if (p <= 14639940) return ((p - 13514940) / 11250) + 2600;
        if (p <= 15809940) return ((p - 14639940) / 11700) + 2700;
        if (p <= 17024940) return ((p - 15809940) / 12150) + 2800;
        if (p <= 18284940) return ((p - 17024940) / 12600) + 2900;
        if (p <= 19589940) return ((p - 18284940) / 13050) + 3000;
        if (p <= 20939940) return ((p - 19589940) / 13950) + 3100;
        if (p <= 22334940) return ((p - 20939940) / 14400) + 3200;
        if (p <= 23774940) return ((p - 22334940) / 14850) + 3300;
        if (p <= 25259940) return ((p - 23774940) / 15300) + 3400;
        if (p <= 26789940) return ((p - 25259940) / 15750) + 3500;
        if (p <= 28364940) return ((p - 26789940) / 16200) + 3600;
        if (p <= 29984940) return ((p - 28364940) / 16650) + 3700;
        if (p <= 31649940) return ((p - 29984940) / 17100) + 3800;
        return ((p - 31649940) / 17550) + 3900;
    }

    /**
     * Calcula o nível inteiro da PSN (arredondado para baixo, ex: Math.floor).
     * @param {number} points
     * @returns {number}
     */
    static calculateLevel(points) {
        return Math.floor(LevelCalculator.calculateRawLevel(points));
    }

    /**
     * Retorna os metadados visuais da patente com base no nível (ícone, borda e nome amigável).
     * @param {number|string} level
     * @returns {{ tier: string, subTier: number, name: string, iconKey: string, borderKey: string }}
     */
    static getTierInfo(level) {
        const lvl = Number(level) || 1;
        if (lvl <= 99)  return { tier: 'bronze',   subTier: 1, name: "Bronze 1", iconKey: "imglvb1", borderKey: "imgbb" };
        if (lvl <= 199) return { tier: 'bronze',   subTier: 2, name: "Bronze 2", iconKey: "imglvb2", borderKey: "imgbb" };
        if (lvl <= 299) return { tier: 'bronze',   subTier: 3, name: "Bronze 3", iconKey: "imglvb3", borderKey: "imgbb" };
        if (lvl <= 399) return { tier: 'silver',   subTier: 1, name: "Prata 1",  iconKey: "imglvp1", borderKey: "imgbp" };
        if (lvl <= 499) return { tier: 'silver',   subTier: 2, name: "Prata 2",  iconKey: "imglvp2", borderKey: "imgbp" };
        if (lvl <= 599) return { tier: 'silver',   subTier: 3, name: "Prata 3",  iconKey: "imglvp3", borderKey: "imgbp" };
        if (lvl <= 699) return { tier: 'gold',     subTier: 1, name: "Ouro 1",   iconKey: "imglvo1", borderKey: "imgbo" };
        if (lvl <= 799) return { tier: 'gold',     subTier: 2, name: "Ouro 2",   iconKey: "imglvo2", borderKey: "imgbo" };
        if (lvl <= 998) return { tier: 'gold',     subTier: 3, name: "Ouro 3",   iconKey: "imglvo3", borderKey: "imgbo" };
        return                 { tier: 'platinum', subTier: 1, name: "Platina",  iconKey: "imglvpl", borderKey: "imgbpl" };
    }
}

if (typeof globalThis !== 'undefined') {
    globalThis.LevelCalculator = LevelCalculator;
}
if (typeof window !== 'undefined') {
    window.LevelCalculator = LevelCalculator;
}
