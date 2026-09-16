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
    primarySelector: '#menu tr:has(img[src*="Lancamentos"])',
    fallbackSelector: '#menu tr:has(a[href*="jogos/?index=lan"]), #menu a[href*="jogos/?index=lan"], #menu img[src*="Lancamentos"]',
    insertPosition: 'before'
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
