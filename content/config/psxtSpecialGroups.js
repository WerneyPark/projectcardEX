/**
 * psxtSpecialGroups.js — Configuração de grupos especiais e cards exclusivos do PSXTrophies.
 */

const PSXT_HAREM_GALAS_GROUP_ID = "555bbd8d-705f-4be1-99b1-a722625ac285";

const PSXT_HAREM_GALAS_MEMBERS = [
    "laddyvalentine", "Mika-Bogarin", "Yuukkiii", "ArieleBH19",
    "Mariellemc7", "bklautau", "Madrinha_fla", "n_trajano",
    "Jennie_san", "Laynara_21", "Ella_Madness", "Pri8521",
    "Juliafclima", "gigivieira_", "NahSanches", "nalauravp"
];

const PSXT_HAREM_IMAGES = {
    base:                "https://projectcard.com.br/img/ALFA/basegalaG.png",
    baseCirc:            "https://projectcard.com.br/img/ALFA/basegalaAvCirc.png",
    baseQuad:            "https://projectcard.com.br/img/ALFA/basegalaAvQuad.png",
    baseAvatarCircular:  "https://projectcard.com.br/img/ALFA/basegalaAvCircBor.png",
    baseAvatarQuadrado:  "https://projectcard.com.br/img/ALFA/basegalaAvQuadBord.png"
};

const PSXT_HAREM_VARIANTS = [
    { id: "circular", label: "Circular", isDefault: true },
    { id: "quadrado", label: "Quadrado" }
];

/**
 * Verifica se um PSN ID pertence ao grupo Harém das Galas.
 * @param {string} psnId
 * @returns {boolean}
 */
function isPsxtHaremMember(psnId) {
    if (!psnId) return false;
    const cleanId = String(psnId).trim().toLowerCase();
    return PSXT_HAREM_GALAS_MEMBERS.some(m => m.toLowerCase() === cleanId);
}

if (typeof globalThis !== 'undefined') {
    globalThis.PSXT_HAREM_GALAS_GROUP_ID = PSXT_HAREM_GALAS_GROUP_ID;
    globalThis.PSXT_HAREM_GALAS_MEMBERS = PSXT_HAREM_GALAS_MEMBERS;
    globalThis.PSXT_HAREM_IMAGES = PSXT_HAREM_IMAGES;
    globalThis.PSXT_HAREM_VARIANTS = PSXT_HAREM_VARIANTS;
    globalThis.isPsxtHaremMember = isPsxtHaremMember;
}
if (typeof window !== 'undefined') {
    window.PSXT_HAREM_GALAS_GROUP_ID = PSXT_HAREM_GALAS_GROUP_ID;
    window.PSXT_HAREM_GALAS_MEMBERS = PSXT_HAREM_GALAS_MEMBERS;
    window.PSXT_HAREM_IMAGES = PSXT_HAREM_IMAGES;
    window.PSXT_HAREM_VARIANTS = PSXT_HAREM_VARIANTS;
    window.isPsxtHaremMember = isPsxtHaremMember;
}
