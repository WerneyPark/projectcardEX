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
    " EduNews":         { normalKey: "basenot",      perfilKey: "basenotb" },
    " EduNews ":        { normalKey: "basemod",      perfilKey: "basemodb" },
    " MamyBR":          { normalKey: "basemod",      perfilKey: "basemodb" },
    " MamyBR ":         { normalKey: "basenot",      perfilKey: "basenotb" },
    "gabriellobo1101":  { normalKey: "basemod",      perfilKey: "basemodb" },
    " FBanin":          { normalKey: "basemod",      perfilKey: "basemodb" },
    "MorpheuVRJ":       { normalKey: "basemod",      perfilKey: "basemodb" },
    "Tognassolo":       { normalKey: "baseden",      perfilKey: "basedenb" },
    "LucasDiasC":       { normalKey: "baseden",      perfilKey: "basedenb" },
    "lionflu":          { normalKey: "baseden",      perfilKey: "basedenb" },
    " MGZoio":          { normalKey: "baseden",      perfilKey: "basedenb" },
    " MGZoio ":         { normalKey: "basemod",      perfilKey: "basemodb" }
};

const MYPST_PLATINUM_IDS = [
    "EduNews", "SABBATH1979", "laddyvalentine", "bklautau",
    "Marcel_pfs1", "DaniloSouza84", "Hidra13", "SobrinhaYstranha",
    "Ikaros-NEX", "dfop02"
];

/**
 * Resolve as imagens de fundo e perfil para um usuário do MyPST.
 * @param {string} psnId
 * @param {Object} images - Imagens carregadas
 * @param {HTMLImageElement} defaultFundo
 * @param {HTMLImageElement} defaultPerfil
 * @returns {{ normal: HTMLImageElement, perfil: HTMLImageElement }}
 */
function resolveMypstUserBases(psnId, images, defaultFundo, defaultPerfil) {
    if (!psnId) {
        return { normal: defaultFundo, perfil: defaultPerfil };
    }

    if (MYPST_SPECIAL_USERS[psnId]) {
        const conf = MYPST_SPECIAL_USERS[psnId];
        return {
            normal: images[conf.normalKey] || defaultFundo,
            perfil: images[conf.perfilKey] || defaultPerfil
        };
    }

    if (MYPST_PLATINUM_IDS.includes(psnId)) {
        return {
            normal: images.baseplatina || defaultFundo,
            perfil: defaultPerfil
        };
    }

    return { normal: defaultFundo, perfil: defaultPerfil };
}

if (typeof globalThis !== 'undefined') {
    globalThis.MYPST_SPECIAL_IMAGES = MYPST_SPECIAL_IMAGES;
    globalThis.MYPST_SPECIAL_USERS = MYPST_SPECIAL_USERS;
    globalThis.MYPST_PLATINUM_IDS = MYPST_PLATINUM_IDS;
    globalThis.resolveMypstUserBases = resolveMypstUserBases;
}
if (typeof window !== 'undefined') {
    window.MYPST_SPECIAL_IMAGES = MYPST_SPECIAL_IMAGES;
    window.MYPST_SPECIAL_USERS = MYPST_SPECIAL_USERS;
    window.MYPST_PLATINUM_IDS = MYPST_PLATINUM_IDS;
    window.resolveMypstUserBases = resolveMypstUserBases;
}
