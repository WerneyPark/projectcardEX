/**
 * mypstSpecialUsers.js — Configuração de skins VIP, analistas, moderadores e administradores do MyPST.
 */

const MYPST_SPECIAL_IMAGES = {
    basebanin: "https://projectcard.com.br/img/ALFA/fundobanin.png",
    basebaninb: "https://projectcard.com.br/img/ALFA/fundobaninb.png",
    baseplatina: "https://projectcard.com.br/img/ALFA/baseplatina.png",
    baseanalista: "https://projectcard.com.br/img/ALFA/baseanalista.png",
    baseanalistab: "https://projectcard.com.br/img/ALFA/baseanalistab.png",
    basered: "https://projectcard.com.br/img/ALFA/basered.png",
    baseredb: "https://projectcard.com.br/img/ALFA/baseredb.png",
    basewp: "https://projectcard.com.br/img/ALFA/basewp.png",
    basewpb: "https://projectcard.com.br/img/ALFA/basewpb.png",
    basebad: "https://projectcard.com.br/img/ALFA/basebad.png",
    basebadb: "https://projectcard.com.br/img/ALFA/basebadb.png",
    baseden: "https://projectcard.com.br/img/ALFA/baseden.png",
    basedenb: "https://projectcard.com.br/img/ALFA/basedenb.png",
    basemod: "https://projectcard.com.br/img/ALFA/basemod.png",
    basemodb: "https://projectcard.com.br/img/ALFA/basemodb.png",
    basenot: "https://projectcard.com.br/img/ALFA/basenot.png",
    basenotb: "https://projectcard.com.br/img/ALFA/basenotb.png"
};

/**
 * Usuários com múltiplas variantes de cartões (selecionáveis na interface).
 */
const MYPST_USER_VARIANTS = {
    "MamyBR": [
        { id: "redatora",     label: "Redatora",     normalKey: "basered",     perfilKey: "baseredb",   isDefault: true },
        { id: "moderadora",   label: "Moderadora",   normalKey: "basemod",     perfilKey: "basemodb" },
        { id: "noticiarista", label: "Noticiarista", normalKey: "basenot",     perfilKey: "basenotb" }
    ],
    "EduNews": [
        { id: "platina",      label: "Platina",      normalKey: "baseplatina", perfilKey: "imgTperf",   isDefault: true },
        { id: "noticiarista", label: "Noticiarista", normalKey: "basenot",     perfilKey: "basenotb" },
        { id: "moderador",    label: "Moderador",    normalKey: "basemod",     perfilKey: "basemodb" }
    ],
    "FBanin": [
        { id: "exclusiva",    label: "Especial Banin", normalKey: "basebanin", perfilKey: "basebaninb", isDefault: true },
        { id: "moderador",    label: "Moderador",    normalKey: "basemod",     perfilKey: "basemodb" }
    ],
    "MGZoio": [
        { id: "redator",      label: "Redator",      normalKey: "basered",     perfilKey: "baseredb",   isDefault: true },
        { id: "denunciante",  label: "Denunciante",  normalKey: "baseden",     perfilKey: "basedenb" },
        { id: "moderador",    label: "Moderador",    normalKey: "basemod",     perfilKey: "basemodb" }
    ]
};

/**
 * Usuários com skin única atribuída automaticamente.
 */
const MYPST_SPECIAL_USERS = {
    "WerneyPark":       { normalKey: "basewp",       perfilKey: "basewpb" },
    "FBanin":           { normalKey: "basebanin",    perfilKey: "basebaninb" },
    "LoiroCroft":       { normalKey: "baseanalista", perfilKey: "baseanalistab" },
    "LucasIIGD":        { normalKey: "baseanalista", perfilKey: "baseanalistab" },
    "MGZoio":           { normalKey: "basered",      perfilKey: "baseredb" },
    "fabriciols":       { normalKey: "basered",      perfilKey: "baseredb" },
    "Toushi-san":       { normalKey: "basered",      perfilKey: "baseredb" },
    "MamyBR":           { normalKey: "basered",      perfilKey: "baseredb" },
    "ZakJapa":          { normalKey: "basered",      perfilKey: "baseredb" },
    "GIBATSAN":         { normalKey: "basered",      perfilKey: "baseredb" },
    "Wesp_can":         { normalKey: "baseanalista", perfilKey: "baseanalistab" },
    "fabio_lokura":     { normalKey: "baseanalista", perfilKey: "baseanalistab" },
    "Kabanas22":        { normalKey: "baseanalista", perfilKey: "baseanalistab" },
    "InsaneMarcel":     { normalKey: "baseanalista", perfilKey: "baseanalistab" },
    "AnzaiRossi":       { normalKey: "baseanalista", perfilKey: "baseanalistab" },
    "DesmaBR":          { normalKey: "baseanalista", perfilKey: "baseanalistab" },
    "LeoCosAffo":       { normalKey: "baseanalista", perfilKey: "baseanalistab" },
    "nabinha":          { normalKey: "basebad",      perfilKey: "basebadb" },
    "zTREVOLz":         { normalKey: "basebad",      perfilKey: "basebadb" },
    "FreddieGellar":    { normalKey: "basebad",      perfilKey: "basebadb" },
    "STARBLAC":         { normalKey: "basenot",      perfilKey: "basenotb" },
    "blackgndrf":       { normalKey: "basenot",      perfilKey: "basenotb" },
    "Tio_Maluco":       { normalKey: "basenot",      perfilKey: "basenotb" },
    "gabriellobo1101":  { normalKey: "basemod",      perfilKey: "basemodb" },
    "MorpheuVRJ":       { normalKey: "basemod",      perfilKey: "basemodb" },
    "Tognassolo":       { normalKey: "baseden",      perfilKey: "basedenb" },
    "LucasDiasC":       { normalKey: "baseden",      perfilKey: "basedenb" },
    "lionflu":          { normalKey: "baseden",      perfilKey: "basedenb" }
};

const MYPST_PLATINUM_IDS = [
    "EduNews", "SABBATH1979", "laddyvalentine", "bklautau",
    "Marcel_pfs1", "DaniloSouza84", "Hidra13", "SobrinhaYstranha",
    "Ikaros-NEX", "dfop02"
];

/**
 * Retorna as variantes de cartões disponíveis para um PSN ID.
 * @param {string} psnId
 * @returns {Array<{ id: string, label: string, normalKey: string, perfilKey: string, isDefault?: boolean }>}
 */
function getMypstUserVariants(psnId) {
    if (!psnId) return [];
    return MYPST_USER_VARIANTS[psnId] || [];
}

/**
 * Resolve as imagens de fundo e perfil para um usuário do MyPST.
 * Suporta seleção dinâmica de variante via variantId.
 * @param {string} psnId
 * @param {Object} images - Imagens carregadas
 * @param {HTMLImageElement} defaultFundo
 * @param {HTMLImageElement} defaultPerfil
 * @param {string} [variantId] - Identificador da variante desejada
 * @returns {{ normal: HTMLImageElement, perfil: HTMLImageElement }}
 */
function resolveMypstUserBases(psnId, images, defaultFundo, defaultPerfil, variantId = null) {
    if (!psnId) {
        return { normal: defaultFundo, perfil: defaultPerfil };
    }

    // 1. Verifica se o usuário possui variantes cadastradas
    const variants = getMypstUserVariants(psnId);
    if (variants && variants.length > 0) {
        let activeVariant = null;
        if (variantId) {
            activeVariant = variants.find(v => v.id === variantId);
        }
        if (!activeVariant) {
            activeVariant = variants.find(v => v.isDefault) || variants[0];
        }

        if (activeVariant) {
            return {
                normal: images[activeVariant.normalKey] || defaultFundo,
                perfil: images[activeVariant.perfilKey] || defaultPerfil
            };
        }
    }

    // 2. Usuário com skin única cadastrada
    if (MYPST_SPECIAL_USERS[psnId]) {
        const conf = MYPST_SPECIAL_USERS[psnId];
        return {
            normal: images[conf.normalKey] || defaultFundo,
            perfil: images[conf.perfilKey] || defaultPerfil
        };
    }

    // 3. Usuário do Clube da Platina
    if (MYPST_PLATINUM_IDS.includes(psnId)) {
        return {
            normal: images.baseplatina || defaultFundo,
            perfil: defaultPerfil
        };
    }

    // 4. Jogador padrão
    return { normal: defaultFundo, perfil: defaultPerfil };
}

if (typeof globalThis !== 'undefined') {
    globalThis.MYPST_SPECIAL_IMAGES = MYPST_SPECIAL_IMAGES;
    globalThis.MYPST_USER_VARIANTS = MYPST_USER_VARIANTS;
    globalThis.MYPST_SPECIAL_USERS = MYPST_SPECIAL_USERS;
    globalThis.MYPST_PLATINUM_IDS = MYPST_PLATINUM_IDS;
    globalThis.getMypstUserVariants = getMypstUserVariants;
    globalThis.resolveMypstUserBases = resolveMypstUserBases;
}
if (typeof window !== 'undefined') {
    window.MYPST_SPECIAL_IMAGES = MYPST_SPECIAL_IMAGES;
    window.MYPST_USER_VARIANTS = MYPST_USER_VARIANTS;
    window.MYPST_SPECIAL_USERS = MYPST_SPECIAL_USERS;
    window.MYPST_PLATINUM_IDS = MYPST_PLATINUM_IDS;
    window.getMypstUserVariants = getMypstUserVariants;
    window.resolveMypstUserBases = resolveMypstUserBases;
}
