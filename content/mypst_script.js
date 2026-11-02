/**
 * Entry script do projectcardEX para o site MyPST (mypst.com.br).
 *
 * O MyPST carrega o conteúdo de perfil via jQuery AJAX após a página inicial.
 * Usamos um MutationObserver + setInterval para garantir que o DOM esteja
 * populado antes de injetar a UI.
 *
 * Ponto de injeção: barra lateral direita (#menu), entre o banner MyPlus e Lançamentos.
 */
const mypstExtractor = new MypstExtractor();
const mypstController = new UIController(mypstExtractor, {
    primarySelector: 'nav[aria-label="Seções do perfil"], #menu tr:has(img[src*="Lancamentos"])',
    fallbackSelector: 'div.flex.flex-col.min-w-0.w-full.rounded-sm.overflow-hidden.bg-primaria, #menu tr:has(a[href*="jogos/?index=lan"]), #menu a[href*="jogos/?index=lan"], #menu img[src*="Lancamentos"]',
    insertPosition: (anchorEl) => (anchorEl.closest && anchorEl.closest('#menu')) ? 'before' : 'after'
});

mypstController.registerRenderer(
    'mypst',
    new MypstDefaultRenderer(),
    'https://projectcard.com.br/img/icons/mypst1Logo64.png',
    'Gerar Cartão MyPST 1'
);

mypstController.registerRenderer(
    'mypst2',
    new Mypst2Renderer(),
    'https://projectcard.com.br/img/icons/mypst2Logo64.png',
    'Gerar Cartão MyPST 2'
);

// Injeta a UI periodicamente para lidar com o carregamento AJAX do MyPST
setInterval(() => mypstController.injectUI(), 1500);
