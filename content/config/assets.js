/**
 * assets.js — Centralização de URLs de assets da PlayStation Network e da extensão.
 */

const PSN_LEVEL_ASSETS = {
    // Ícones de Nível
    imglvb1: "https://projectcard.com.br/img/lvspsn/bronze_level_1.png",
    imglvb2: "https://projectcard.com.br/img/lvspsn/bronze_level_2.png",
    imglvb3: "https://projectcard.com.br/img/lvspsn/bronze_level_3.png",
    imglvp1: "https://projectcard.com.br/img/lvspsn/silver_level_1.png",
    imglvp2: "https://projectcard.com.br/img/lvspsn/silver_level_2.png",
    imglvp3: "https://projectcard.com.br/img/lvspsn/silver_level_3.png",
    imglvo1: "https://projectcard.com.br/img/lvspsn/gold_level_1.png",
    imglvo2: "https://projectcard.com.br/img/lvspsn/gold_level_2.png",
    imglvo3: "https://projectcard.com.br/img/lvspsn/gold_level_3.png",
    imglvpl: "https://projectcard.com.br/img/lvspsn/platinum_level.png",

    // Bordas de Nível
    imgbpl:  "https://projectcard.com.br/img/lvspsn/bordanivelplatina.png",
    imgbo:   "https://projectcard.com.br/img/lvspsn/bordanivelouro.png",
    imgbp:   "https://projectcard.com.br/img/lvspsn/bordanivelprata.png",
    imgbb:   "https://projectcard.com.br/img/lvspsn/bordanivelbronze.png"
};

const EXTENSION_ICONS = {
    psxtLogo: "https://projectcard.com.br/img/icons/logo180.png",
    pggLogo: "https://projectcard.com.br/img/icons/pggLogo64.png",
    psnlLogo: "https://projectcard.com.br/img/icons/psnlLogo64.png",
    mypstLogo: "https://projectcard.com.br/img/icons/mypst1Logo64.png",
    mypstLogo2: "https://projectcard.com.br/img/icons/mypst2Logo64.png",
    defaultCard: "https://projectcard.com.br/img/ALFA/projectcard.png"
};

const MYPST2_VARIANTS_ASSETS = {
    azul: {
        fundo: "https://projectcard.com.br/img/ALFA/basealfamypst2.png",
        borda: "https://projectcard.com.br/img/ALFA/imgperfbordamypst22.png"
    },
    dark: {
        fundo: "https://projectcard.com.br/img/ALFA/basealfamypst2preto.png",
        borda: "https://projectcard.com.br/img/ALFA/imgperfbordamypst2preta.png"
    }
};

if (typeof globalThis !== 'undefined') {
    globalThis.PSN_LEVEL_ASSETS = PSN_LEVEL_ASSETS;
    globalThis.EXTENSION_ICONS = EXTENSION_ICONS;
    globalThis.MYPST2_VARIANTS_ASSETS = MYPST2_VARIANTS_ASSETS;
}
if (typeof window !== 'undefined') {
    window.PSN_LEVEL_ASSETS = PSN_LEVEL_ASSETS;
    window.EXTENSION_ICONS = EXTENSION_ICONS;
    window.MYPST2_VARIANTS_ASSETS = MYPST2_VARIANTS_ASSETS;
}
