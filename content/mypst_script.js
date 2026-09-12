/**
 * Entry script do projectcardEX para o site MyPST (mypst.com.br).
 *
 * O MyPST carrega o conteúdo de perfil via jQuery AJAX após a página inicial.
 * Usamos um MutationObserver + setInterval para garantir que o DOM esteja
 * populado antes de injetar a UI.
 *
 * Ponto de injeção: div#meio (barra azul com level/pontos), inserindo antes dela.
 */
const mypstExtractor = new MypstExtractor();
const mypstController = new UIController(mypstExtractor, {
    // O bloco de pontos/level fica em div#meio (segundo #meio é o de stats)
    primarySelector: 'div#meio',
    fallbackSelector: 'div[style*="235bc2"]',
    insertPosition: 'before'
});

mypstController.registerRenderer(
    'mypst',
    new MypstDefaultRenderer(),
    'https://projectcard.com.br/img/ALFA/projectcard.png',
    'Gerar Cartão MyPST 1'
);

mypstController.registerRenderer(
    'mypst2',
    new Mypst2Renderer(),
    'https://projectcard.com.br/img/ALFA/projectcard.png',
    'Gerar Cartão MyPST 2'
);

// Injeta a UI periodicamente para lidar com o carregamento AJAX do MyPST
setInterval(() => mypstController.injectUI(), 1500);
